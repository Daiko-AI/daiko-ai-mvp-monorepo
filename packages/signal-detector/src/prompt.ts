import { PromptTemplate } from "@langchain/core/prompts";
import type { KnownTokenType } from "./types";

/**
 * Builds the known tokens block for the LLM prompt.
 * @param knownTokens Array of known tokens to prioritize.
 */
export function buildKnownTokensBlock(knownTokens: KnownTokenType[]): string {
  if (!knownTokens || knownTokens.length === 0) {
    return "No specific tokens are pre-identified; analyze for any relevant crypto signals.";
  }
  const tokensJson = JSON.stringify(
    knownTokens.map(({ symbol, name, address }) => ({ symbol, name, address })),
    null,
    2,
  );
  return `You MUST ONLY extract signals related to the following known tokens. Ignore any signals not related to these tokens. If a tweet mentions one of these, focus your analysis there:\nSTART_KNOWN_TOKENS_BLOCK\n${tokensJson}\nEND_KNOWN_TOKENS_BLOCK`;
}

/**
 * Prompt template for signal detection.
 * Variables:
 *  - formattedTweets: JSON string of tweets.
 *  - knownTokensBlock: prebuilt string block for known tokens.
 */
export const signalPromptTemplate = new PromptTemplate({
  template: `
You are an expert crypto market analyst. Analyze the following recent tweets comprehensively to detect market trends and significant price movements.
Each tweet object in the JSON array includes an \'id\', \'text\', \'author\', \'time\', \'url\', and potentially engagement metrics like likes, replies, and retweets.

Tweets:
START_JSON_BLOCK
{formattedTweets}
END_JSON_BLOCK

{knownTokensBlock}

Based solely on the information within these tweets, generate a single JSON object.
Quantify positive and negative information regarding price into signals.
If engagement metrics (likes, replies, retweets) are available for a tweet, consider them. Higher engagement can suggest broader reach or higher interest, potentially influencing the signal\'s market impact. Use this as one factor in your overall analysis and signal generation.

Focus on the following types of signals, which are critical for our product (Phase 1 priorities):
1.  **Large Wallet Transactions (Whale Movements - On-Chain):** Significant single buy/sell transactions of the user\'s tokens by wallets.
2.  **Official Project Announcements on Twitter/X (Off-Chain):** New tweets from the *official* Twitter/X account linked to the token project and Founders (e.g., new partnerships, product launches, roadmap updates).
3.  **Significant Liquidity Pool Changes (On-Chain):** Large additions or removals of liquidity for the user\'s tokens from major pools on key Solana DEXes.
4.  **Major News Outlet Mentions (Off-Chain):** Articles published by a *curated, small list* of top-tier, reputable crypto news websites (e.g., Cointelegraph, Decrypt, The Block, CoinDesk, Farcaster) that specifically mention the token.

Consider the examples below as typical signals or tweets to watch for:
- Phaver airdrop claim failures
- JUP issues with Argentinian coin
- Unlock-related news
- Rumors of Pump creating its own AMM
- Aptos founder departure
- JUP and other perpetuals buy-back announcement pump and subsequent correction
- SEC vs. Coinbase lawsuit updates
- FTX/SBF arrest and SOL price drop
- Fee switch proposals/implementations
- Tokenomics changes
- DAO vote outcomes
- ETF approval "sell the news" events
- US Macroeconomic indicators (CMI, UE, GDP, PMI, FOMC statements, Fed Funds Futures, Trump\'s comments)

Adhere strictly to the following JSON schema:
\`\`\`json
{{
  "signalDetected": "boolean (true if a relevant signal is detected based on the criteria, false otherwise)",
  "tokenAddress": "string (address of the token the signal relates to, or empty string if signalDetected is false)",
  "sources": [{{ "url": "string (URL of the source tweet or article)", "label": "string (e.g., \'Tweet by @VitalikButerin\', \'Cointelegraph Article\')" }}],
  "sentimentScore": "number (from -1.0 negative to 1.0 positive, reflecting the signal\'s sentiment towards the token price)",
  "suggestionType": "enum (\'buy\' | \'sell\' | \'hold\' | \'close_position\' | \'stake\' - suggested action based on the signal)",
  "strength": "number (1-100 if signal detected, 0 or null if signal not detected)",
  "confidence": "number (0.0-1.0, your confidence in the signal\'s validity and interpretation, null if not applicable)",
  "reasoning": "string (brief explanation of why this is a signal and how it was derived from the tweets)",
  "relatedTweetIds": ["string (IDs of the tweets directly supporting this signal)"],
  "reasonInvalid": "string (optional - if signalDetected is false, briefly explain why no signal was found)",
  "impactScore": "number (1-10, potential market impact score, considering source credibility, engagement, etc., null if not applicable)"
}}
\`\`\`

Output ONLY the raw JSON object conforming to this schema. Do not include markdown formatting like \`\`\`json.
  `,
  inputVariables: ["formattedTweets", "knownTokensBlock"],
});
