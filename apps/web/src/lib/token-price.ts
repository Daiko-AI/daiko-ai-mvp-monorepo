import { cache } from "react";

interface TokenPrice {
  usdPrice: string;
  lastUpdated: Date;
}

interface JupiterPriceResponse {
  data: {
    [tokenAddress: string]: {
      id: string;
      type: string;
      price: string;
    };
  };
  timeTaken: number;
}

class TokenPriceService {
  private static instance: TokenPriceService;
  private jupiterApiUrl: string;
  private cache: Map<string, TokenPrice>;
  private cacheTimeout: number;

  private constructor() {
    this.jupiterApiUrl = "https://api.jup.ag/price/v2";
    this.cache = new Map();
    this.cacheTimeout = 60 * 1000; // 1分
  }

  public static getInstance(): TokenPriceService {
    if (!TokenPriceService.instance) {
      TokenPriceService.instance = new TokenPriceService();
    }
    return TokenPriceService.instance;
  }

  private isCacheValid(lastUpdated: Date): boolean {
    return Date.now() - lastUpdated.getTime() < this.cacheTimeout;
  }

  public async getTokenPrices(tokenAddresses: string[]): Promise<Record<string, string>> {
    try {
      const uniqueAddresses = Array.from(new Set(tokenAddresses));
      const result: Record<string, string> = {};
      const addressesToFetch: string[] = [];

      // キャッシュをチェック
      uniqueAddresses.forEach((address) => {
        const cached = this.cache.get(address);
        if (cached && this.isCacheValid(cached.lastUpdated)) {
          result[address] = cached.usdPrice;
        } else {
          addressesToFetch.push(address);
        }
      });

      if (addressesToFetch.length === 0) {
        return result;
      }

      // 未キャッシュの価格を取得
      const addressesParam = addressesToFetch.join(",");
      const response = await fetch(`${this.jupiterApiUrl}?ids=${addressesParam}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.status}`);
      }

      const priceData = (await response.json()) as JupiterPriceResponse;

      // 結果を処理してキャッシュを更新
      addressesToFetch.forEach((address) => {
        const price = priceData.data[address]?.price;
        if (price) {
          result[address] = price;
          this.cache.set(address, {
            usdPrice: price,
            lastUpdated: new Date(),
          });
        }
      });

      return result;
    } catch (error) {
      console.error("Failed to fetch token prices:", error);
      return {};
    }
  }
}

export const getTokenPrices = cache(async (tokenAddresses: string[]): Promise<Record<string, string>> => {
  const service = TokenPriceService.getInstance();
  return await service.getTokenPrices(tokenAddresses);
});
