import "dotenv/config";
import cron from "node-cron";
import { processTokenPrices } from "./process";

/**
 * ローカル環境で実行するためのスクリプト
 * 1. ワンタイム実行モード
 * 2. CRON実行モード
 * 3. 特定トークン検索モード
 */
async function main() {
  console.log("=== Jupiter価格更新ジョブ ===");

  // コマンドライン引数を解析
  const args = process.argv.slice(2);
  const isCronMode = args.includes("--cron");
  const tokenArg = args.find((arg) => arg.startsWith("--token="));
  const specificTokenAddress = tokenArg?.split("=")[1];

  // 特定トークンモード
  if (specificTokenAddress) {
    console.log(`特定のトークン価格取得モード`);
    const result = await processTokenPrices({ specificTokenAddress });
    console.log(result);
    process.exit(result.success ? 0 : 1);
  }

  // CRONモード
  if (isCronMode) {
    const cronExpression = process.env.PRICE_UPDATE_CRON || "*/10 * * * *"; // デフォルトは10分ごと
    console.log(`CRONモード: ${cronExpression}`);

    cron.schedule(cronExpression, async () => {
      try {
        console.log(`\n[${new Date().toISOString()}] CRON実行`);
        const result = await processTokenPrices();
        console.log(result);
      } catch (error) {
        console.error("CRON実行エラー:", error);
      }
    });

    console.log("バックグラウンドで実行中... Ctrl+Cで終了");
    return;
  }

  // ワンタイム実行モード（デフォルト）
  console.log("ワンタイム実行モード");
  const result = await processTokenPrices();
  console.log(result);
  process.exit(result.success ? 0 : 1);
}

// メイン処理を開始
main().catch((error) => {
  console.error("予期せぬエラーが発生しました:", error);
  process.exit(1);
});
