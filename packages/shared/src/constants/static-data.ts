import type { ProposalInsert, TokenInsert } from "../db/schema";

export const initialTokens: TokenInsert[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Wrapped SOL",
    decimals: 9,
    type: "normal",
    iconUrl: "/tokens/SOL.png",
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/USDC.png",
  },
  {
    address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    symbol: "TRUMP",
    name: "OFFICIAL TRUMP",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/TRUMP.png",
  },
  {
    address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    symbol: "JUP",
    name: "Jupiter",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/JUP.png",
  },
  {
    address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    symbol: "WIF",
    name: "dogwifhat",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/WIF.png",
  },
  {
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    decimals: 5,
    type: "normal",
    iconUrl: "/tokens/BONK.png",
  },
  {
    address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
    symbol: "JTO",
    name: "Jito",
    decimals: 9,
    type: "normal",
    iconUrl: "/tokens/JTO.png",
  },
  {
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    symbol: "RAY",
    name: "Raydium",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/RAY.png",
  },
  {
    address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    symbol: "PYTH",
    name: "Pyth Network",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/PYTH.png",
  },
  {
    address: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux",
    symbol: "HNT",
    name: "Helium Network Token",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/HNT.png",
  },
  {
    address: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
    symbol: "W",
    name: "Wormhole",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/W.png",
  },
  {
    address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
    symbol: "MEW",
    name: "cat in a dogs world",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/MEW.png",
  },
  {
    address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    symbol: "POPCAT",
    name: "Popcat (SOL)",
    decimals: 9,
    type: "normal",
    iconUrl: "/tokens/POPCAT.png",
  },
  {
    address: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    symbol: "ORCA",
    name: "Orca",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/ORCA.png",
  },
  {
    address: "ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq",
    symbol: "ZEUS",
    name: "Zeus Network",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/ZEUS.png",
  },
  {
    address: "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS",
    symbol: "KMNO",
    name: "Kamino",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/KMNO.png",
  },
  {
    address: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
    symbol: "WBTC",
    name: "Wrapped Bitcoin (Portal)",
    decimals: 8,
    type: "normal",
    iconUrl: "/tokens/WBTC.png",
  },
  {
    address: "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v",
    symbol: "jupSOL",
    name: "Jupiter Staked SOL",
    decimals: 9,
    type: "liquid_staking",
    iconUrl: "/tokens/jupSOL.png",
  },
  {
    address: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    symbol: "JitoSOL",
    name: "Jito Staked SOL",
    decimals: 9,
    type: "liquid_staking",
    iconUrl: "/tokens/JitoSOL.png",
  },
  {
    address: "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
    symbol: "INF",
    name: "Infinity",
    decimals: 9,
    type: "liquid_staking",
    iconUrl: "/tokens/INF.png",
  },
  {
    address: "bioJ9JTqW62MLz7UKHU69gtKhPpGi1BQhccj2kmSvUJ",
    symbol: "BIO",
    name: "BIO",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/BIO.png",
  },
  {
    address: "LAYER4xPpTCb3QL8S9u41EAhAX7mhBn8Q6xMTwY2Yzc",
    symbol: "LAYER",
    name: "Solayer",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/LAYER.png",
  },
  {
    address: "14zP2ToQ79XWvc7FQpm4bRnp9d6Mp1rFfsUW3gpLcRX",
    symbol: "AIXBT",
    name: "aixbt by Virtuals (Wormhole)",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/AIXBT.png",
  },
  {
    address: "GJAFwWjJ3vnTsrQVabjBVK2TYB1YtRCQXRDfDgUnpump",
    symbol: "ACT",
    name: "Act I : The AI Prophecy",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/ACT.png",
  },
  {
    address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
    symbol: "Fartcoin",
    name: "Fartcoin",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/Fartcoin.png",
  },
  {
    address: "FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P",
    symbol: "MELANIA",
    name: "MELANIA",
    decimals: 6,
    type: "normal",
    iconUrl: "/tokens/MELANIA.png",
  },
];

// const SIX_MONTHS_SECONDS = 1000 * 60 * 60 * 24 * 30 * 6;
const STATIC_EXPIRATION_DATE = 1000 * 60 * 60 * 24 * 1;

export const staticProposals: Omit<ProposalInsert, "userId">[] = [
  {
    title: "Reduce 70% $RAY Exposure Due to Announcement of PumpSwap",
    summary: "Reduce 70% of your $RAY holdings due to announcement of PumpSwap",
    reason: [
      "Top 12 wallets reduced $RAY holdings by 10% in the past 72 hours",
      "Pump.fun's switch to PumpSwap reduced Raydium's token migration volume by an estimated 30%",
      "$RAY price has declined 5.2% since the PumpSwap announcement",
    ],
    sources: [
      { name: "Raydium Wallet Movement Tracker", url: "#" },
      { name: "Pump.fun Announcement", url: "#" },
      { name: "DEX Price Analysis", url: "#" },
    ],
    type: "risk",
    proposedBy: "Daiko AI",
    expiresAt: new Date(Date.now() + STATIC_EXPIRATION_DATE - 1000 * 60 * 60 * 3),
    financialImpact: {
      currentValue: 2.4,
      projectedValue: 1.9,
      percentChange: -21,
      timeFrame: "immediate",
      riskLevel: "high",
    },
    status: "active",
    contractCall: {
      type: "swap",
      description: "Sell 70% of RAY for USDC",
      params: {
        fromToken: { symbol: "RAY", address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
        toToken: { symbol: "USDC", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
        fromAmount: 0.7,
      },
    },
  },
  {
    title: "Reduce 60% $Fartcoin Exposure: Critical Support at Risk with Weakening Buy-Side Liquidity",
    summary: "Reduce 60% of your $Fartcoin exposure due to weakening buy-side liquidity and critical support at risk",
    reason: [
      "$Fartcoin repeatedly testing major support at $1.21; multiple failed bounces observed",
      "On-chain liquidity analysis shows thinning buy orders below the current price",
      "Significant cluster of liquidation levels for long positions identified just below $1.21; a break could trigger cascading sell-offs",
      "Rapid increase in exchange deposits observed, indicating widespread panic selling is beginning",
    ],
    sources: [
      { name: "DEX Screener (Price & Volume Analysis)", url: "#" },
      { name: "Daiko On-Chain Liquidity Monitor", url: "#" },
      { name: "Project's Official Communication Channels", url: "#" },
      { name: "Exchange Deposit Tracker", url: "#" },
    ],
    type: "risk",
    proposedBy: "Daiko AI",
    expiresAt: new Date(Date.now() + STATIC_EXPIRATION_DATE - 1000 * 60 * 60 * 2),
    financialImpact: {
      currentValue: 1.3,
      projectedValue: 0.6,
      percentChange: -54,
      timeFrame: "immediate",
      riskLevel: "high",
    },
    status: "active",
    contractCall: {
      type: "swap",
      description: "Sell 60% of Fartcoin for USDC",
      params: {
        fromToken: { symbol: "Fartcoin", address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" },
        toToken: { symbol: "USDC", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
        fromAmount: 464,
      },
    },
  },
  {
    title: "Reduce 70% $MELANIA Exposure Due to Major Exchange Inflow",
    summary: "Reduce 70% of your $MELANIA tokens to mitigate risk following major exchange inflow",
    reason: [
      "Known whale wallet 3Yz6aU...H8iWjJ transferred 2M $MELANIA to Binance",
      "Historically, similar movements from this wallet for this token preceded price drops of 25-30%",
      "Exchange order books show increasing sell-side pressure",
    ],
    sources: [
      { name: "Melania On-Chain Whale Tracker", url: "#" },
      { name: "Whale's Solscan Token Account", url: "#" },
      { name: "Nansen Wallet Profiler", url: "#" },
    ],
    type: "risk",
    proposedBy: "Daiko AI",
    expiresAt: new Date(Date.now() + STATIC_EXPIRATION_DATE - 1000 * 60 * 60 * 1),
    financialImpact: {
      currentValue: 0.48,
      projectedValue: 0.3679,
      percentChange: -23,
      timeFrame: "immediate",
      riskLevel: "high",
    },
    status: "active",
    contractCall: {
      type: "swap",
      description: "Sell 70% of MELANIA for USDC",
      params: {
        fromToken: { symbol: "MELANIA", address: "FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P" },
        toToken: { symbol: "USDC", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
        fromAmount: 1000,
      },
    },
  },
  {
    title: "Stake 0.8 SOL in JitoSOL for Enhanced Yields",
    summary:
      "Earn 8.24% APY by converting your idle 0.8 SOL ($119.18) to JitoSOL, Jito's high-yield liquid staking token",
    reason: [
      "You have 0.8 SOL ($119.18) sitting idle in your wallet", // Updated value
      "JitoSOL offers one of the highest yields among Solana LSTs (8.24% current APY)",
      "Zero fees: 0% management fee, 0% validator commission, 0% stake deposit fee",
    ],
    sources: [
      { name: "JitoSOL Documentation", url: "#" },
      { name: "Solana LST Comparison Analysis", url: "#" },
      { name: "JitoSOL Performance Metrics", url: "#" },
    ],
    type: "stake",
    proposedBy: "Daiko AI",
    expiresAt: new Date(Date.now() + STATIC_EXPIRATION_DATE),
    financialImpact: {
      currentValue: 119.18, // Updated value (0.8 * 148.98)
      projectedValue: 129.03, // Updated projected value (119.18 * 1.0824)
      percentChange: 8.24,
      timeFrame: "1 year",
      riskLevel: "low",
    },
    status: "active",
    contractCall: {
      type: "stake",
      description: "Stake SOL to JitoSOL for higher yields",
      params: {
        fromToken: {
          symbol: "SOL",
          address: "So11111111111111111111111111111111111111112",
        },
        toToken: {
          symbol: "JitoSOL",
          address: "jitoSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v",
        },
        fromAmount: 0.8,
      },
    },
  },
];
