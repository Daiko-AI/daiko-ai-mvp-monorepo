import {
  db,
  tokenPricesTable,
  tokensTable,
  usersTable,
  userBalancesTable,
  transactionsTable,
  investmentsTable,
} from "@daiko-ai/shared";
import BigNumber from "bignumber.js";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// カスタムエラークラスの定義
class TokenError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400,
  ) {
    super(message);
    this.name = "TokenError";
  }
}

// エラーコードの定義
const ErrorCodes = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  INVALID_AMOUNT: "INVALID_AMOUNT",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  BALANCE_NOT_FOUND: "BALANCE_NOT_FOUND",
} as const;

// BigNumberの設定
BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export const tokenRouter = createTRPCRouter({
  /**
   * Get all tokens
   * GET /api/tokens
   */
  getAllTokens: publicProcedure.query(async ({ ctx }) => {
    const tokens = await ctx.db.query.tokensTable.findMany({
      orderBy: [tokensTable.symbol],
    });

    return tokens;
  }),

  /**
   * Get token by symbol
   * GET /api/tokens/:symbol
   */
  getTokenBySymbol: publicProcedure.input(z.object({ symbol: z.string() })).query(async ({ ctx, input }) => {
    const token = await ctx.db.query.tokensTable.findFirst({
      where: eq(tokensTable.symbol, input.symbol),
    });

    return token;
  }),

  /**
   * Get token by address
   * GET /api/tokens/address/:address
   */
  getTokenByAddress: publicProcedure.input(z.object({ address: z.string() })).query(async ({ ctx, input }) => {
    const token = await ctx.db.query.tokensTable.findFirst({
      where: eq(tokensTable.address, input.address),
    });

    return token;
  }),

  /**
   * Get token prices
   * GET /api/tokens/prices
   */
  getTokenPrices: publicProcedure
    .input(
      z.object({
        tokenAddresses: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      // If tokenAddresses is provided, get prices for specific tokens
      if (input.tokenAddresses && input.tokenAddresses.length > 0) {
        const prices = [];
        // We need to fetch prices one by one since "in" operator might not be directly supported
        for (const address of input.tokenAddresses) {
          const price = await ctx.db.query.tokenPricesTable.findFirst({
            where: eq(tokenPricesTable.tokenAddress, address),
            with: {
              token: true,
            },
          });
          if (price) prices.push(price);
        }
        return prices;
      }

      // Otherwise, get prices for all tokens with limit
      const prices = await ctx.db.query.tokenPricesTable.findMany({
        limit: input.limit,
        orderBy: [desc(tokenPricesTable.lastUpdated)],
        with: {
          token: true,
        },
      });

      return prices;
    }),

  /**
   * Get token types
   * GET /api/tokens/types
   */
  getTokenTypes: publicProcedure.query(async ({ ctx }) => {
    // In a real implementation, this would query distinct types from the database
    // For simplicity, we'll return the predefined types
    return [
      { type: "normal", label: "Standard Token" },
      { type: "lending", label: "Lending Token" },
      { type: "perp", label: "Perpetual Futures" },
      { type: "staking", label: "Staking Token" },
    ];
  }),

  /**
   * Get tokens by type
   * GET /api/tokens/by-type/:type
   */
  getTokensByType: publicProcedure
    .input(
      z.object({
        type: z.string(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tokens = await ctx.db.query.tokensTable.findMany({
        where: eq(tokensTable.type, input.type),
        limit: input.limit,
        orderBy: [tokensTable.symbol],
      });

      return tokens;
    }),
  transfer: publicProcedure
    .input(
      z.object({
        fromToken: z.string(),
        toToken: z.string(),
        fromAmount: z.string(),
        toAmount: z.string(),
        walletAddress: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fromToken, toToken, fromAmount, toAmount, walletAddress } = input;

      try {
        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.walletAddress, walletAddress),
        });

        if (!user) {
          throw new TokenError("User not found", ErrorCodes.USER_NOT_FOUND);
        }

        const fromTokenInfo = await db.query.tokensTable.findFirst({
          where: eq(tokensTable.symbol, fromToken),
        });
        const toTokenInfo = await db.query.tokensTable.findFirst({
          where: eq(tokensTable.symbol, toToken),
        });

        if (!fromTokenInfo || !toTokenInfo) {
          throw new TokenError(`Token not found: ${!fromTokenInfo ? fromToken : toToken}`, ErrorCodes.TOKEN_NOT_FOUND);
        }

        // 数値の検証
        const fromAmountBN = new BigNumber(fromAmount || "0");
        const toAmountBN = new BigNumber(toAmount || "0");

        if (fromAmountBN.isNaN() || toAmountBN.isNaN()) {
          throw new TokenError("Invalid amount format", ErrorCodes.INVALID_AMOUNT);
        }

        if (fromAmountBN.isLessThanOrEqualTo(0) || toAmountBN.isLessThanOrEqualTo(0)) {
          throw new TokenError("Amount must be greater than 0", ErrorCodes.INVALID_AMOUNT);
        }

        // 1. Get current balance for the fromToken
        const fromBalanceRecord = await db.query.userBalancesTable.findFirst({
          where: and(eq(userBalancesTable.userId, user.id), eq(userBalancesTable.tokenAddress, fromTokenInfo.address)),
        });

        if (!fromBalanceRecord) {
          throw new TokenError(`No balance record found for ${fromToken}`, ErrorCodes.BALANCE_NOT_FOUND);
        }

        const currentFromBalance = new BigNumber(fromBalanceRecord.balance || "0");

        // 2. Validate balance
        if (currentFromBalance.isLessThan(fromAmountBN)) {
          throw new TokenError(
            `Insufficient balance for ${fromToken}. Required: ${fromAmount}, Available: ${currentFromBalance.toString()}`,
            ErrorCodes.INSUFFICIENT_BALANCE,
          );
        }

        // 3. Decrement fromToken balance
        const newFromBalance = currentFromBalance.minus(fromAmountBN).toString();
        await db
          .update(userBalancesTable)
          .set({ balance: newFromBalance, updatedAt: new Date() })
          .where(eq(userBalancesTable.id, fromBalanceRecord.id));

        // 4. Record transaction
        const transaction = (
          await db
            .insert(transactionsTable)
            .values({
              userId: user.id,
              transactionType: "swap",
              fromTokenAddress: fromTokenInfo.address,
              toTokenAddress: toTokenInfo.address,
              amountFrom: fromAmountBN.toString(),
              amountTo: toAmountBN.toString(),
              details: {
                ...input,
                status: "pending",
              },
              createdAt: new Date(),
            })
            .returning()
        )[0];

        if (!transaction) {
          throw new TokenError("Failed to create transaction record", ErrorCodes.TRANSACTION_FAILED);
        }

        try {
          // 5. Increment toToken balance (Upsert)
          const toBalanceRecord = await db.query.userBalancesTable.findFirst({
            where: and(eq(userBalancesTable.userId, user.id), eq(userBalancesTable.tokenAddress, toTokenInfo.address)),
          });

          if (toBalanceRecord) {
            const currentToBalance = new BigNumber(toBalanceRecord.balance || "0");
            const newToBalance = currentToBalance.plus(toAmountBN).toString();
            await db
              .update(userBalancesTable)
              .set({ balance: newToBalance, updatedAt: new Date() })
              .where(eq(userBalancesTable.id, toBalanceRecord.id));
          } else {
            await db.insert(userBalancesTable).values({
              userId: user.id,
              tokenAddress: toTokenInfo.address,
              balance: toAmountBN.toString(),
              updatedAt: new Date(),
            });
          }

          // 6. Update transaction status
          await db
            .update(transactionsTable)
            .set({
              details: {
                ...input,
                status: "completed",
              },
            })
            .where(eq(transactionsTable.id, transaction.id));

          return {
            success: true,
            txHash: `sim-tx-${Date.now()}`,
          };
        } catch (error) {
          // Compensating transaction: Revert fromToken balance
          await db
            .update(userBalancesTable)
            .set({ balance: currentFromBalance.toString(), updatedAt: new Date() })
            .where(eq(userBalancesTable.id, fromBalanceRecord.id));

          // Update transaction status
          await db
            .update(transactionsTable)
            .set({
              details: {
                ...input,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
                errorCode: error instanceof TokenError ? error.code : ErrorCodes.TRANSACTION_FAILED,
              },
            })
            .where(eq(transactionsTable.id, transaction.id));

          throw error;
        }
      } catch (error) {
        console.error("Transfer failed:", error);
        if (error instanceof TokenError) {
          throw error;
        }
        throw new TokenError(error instanceof Error ? error.message : "Transfer failed", ErrorCodes.TRANSACTION_FAILED);
      }
    }),

  stake: publicProcedure
    .input(
      z.object({
        fromToken: z.string(),
        toToken: z.string(),
        amount: z.string(),
        walletAddress: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fromToken: baseTokenSymbol, toToken: lstTokenSymbol, amount, walletAddress } = input;

      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.walletAddress, walletAddress),
      });

      if (!user) {
        throw new Error("User not found");
      }

      // ベーストークン（例：SOL）の情報を取得
      const baseToken = await db.query.tokensTable.findFirst({
        where: eq(tokensTable.symbol, baseTokenSymbol),
      });

      if (!baseToken) {
        throw new Error(`Base token ${baseTokenSymbol} not found`);
      }

      // LSTトークン（例：jupSOL）の情報を取得
      const lstToken = await db.query.tokensTable.findFirst({
        where: and(eq(tokensTable.symbol, lstTokenSymbol), eq(tokensTable.type, "liquid_staking")),
      });

      if (!lstToken) {
        throw new Error(`LST token ${lstTokenSymbol} not found`);
      }

      const interestRate = "5.0";
      const amountBN = new BigNumber(amount || "0");

      if (amountBN.isNaN()) {
        throw new Error("Invalid amount format");
      }

      if (amountBN.isLessThanOrEqualTo(0)) {
        throw new Error("Amount must be greater than 0");
      }

      try {
        // 1. ベーストークンの残高を確認
        const baseBalanceRecord = await db.query.userBalancesTable.findFirst({
          where: and(eq(userBalancesTable.userId, user.id), eq(userBalancesTable.tokenAddress, baseToken.address)),
        });

        if (!baseBalanceRecord) {
          throw new Error(`No balance record found for ${baseTokenSymbol}`);
        }

        const currentBaseBalance = new BigNumber(baseBalanceRecord.balance || "0");

        // 2. 残高の検証
        if (currentBaseBalance.isLessThan(amountBN)) {
          throw new Error(`Insufficient balance for ${baseTokenSymbol}`);
        }

        // 3. トランザクションを記録
        const transaction = (
          await db
            .insert(transactionsTable)
            .values({
              userId: user.id,
              transactionType: "stake",
              fromTokenAddress: baseToken.address,
              toTokenAddress: lstToken.address,
              amountFrom: amountBN.toString(),
              amountTo: amountBN.toString(), // 1:1の交換レート
              details: {
                ...input,
                status: "pending",
              },
              createdAt: new Date(),
            })
            .returning()
        )[0];

        if (!transaction) {
          throw new Error("Failed to create transaction record");
        }

        try {
          // 4. ベーストークンの残高を減少
          const newBaseBalance = currentBaseBalance.minus(amountBN).toString();
          await db
            .update(userBalancesTable)
            .set({ balance: newBaseBalance, updatedAt: new Date() })
            .where(eq(userBalancesTable.id, baseBalanceRecord.id));

          // 5. LSTの残高を取得または作成
          let lstBalanceRecord = await db.query.userBalancesTable.findFirst({
            where: and(eq(userBalancesTable.userId, user.id), eq(userBalancesTable.tokenAddress, lstToken.address)),
          });

          if (lstBalanceRecord) {
            // 既存のLST残高を更新
            const currentLstBalance = new BigNumber(lstBalanceRecord.balance || "0");
            const newLstBalance = currentLstBalance.plus(amountBN).toString();
            await db
              .update(userBalancesTable)
              .set({ balance: newLstBalance, updatedAt: new Date() })
              .where(eq(userBalancesTable.id, lstBalanceRecord.id));
          } else {
            // 新しいLST残高レコードを作成
            await db.insert(userBalancesTable).values({
              userId: user.id,
              tokenAddress: lstToken.address,
              balance: amountBN.toString(),
              updatedAt: new Date(),
            });
          }

          // 6. 投資記録を作成
          await db.insert(investmentsTable).values({
            userId: user.id,
            tokenAddress: baseToken.address,
            actionType: "staking",
            principal: amountBN.toString(),
            accruedInterest: "0",
            startDate: new Date(),
            lastUpdate: new Date(),
            interestRate: parseFloat(interestRate),
            status: "active",
          });

          // 7. トランザクションステータスを更新
          await db
            .update(transactionsTable)
            .set({
              details: {
                ...input,
                status: "completed",
              },
            })
            .where(eq(transactionsTable.id, transaction.id));

          return {
            success: true,
            txHash: `sim-tx-${Date.now()}`,
          };
        } catch (error) {
          // トランザクションステータスを更新
          await db
            .update(transactionsTable)
            .set({
              details: {
                ...input,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
              },
            })
            .where(eq(transactionsTable.id, transaction.id));

          throw error;
        }
      } catch (error) {
        console.error("Staking failed:", error);
        throw new Error(error instanceof Error ? error.message : "Staking failed");
      }
    }),
});
