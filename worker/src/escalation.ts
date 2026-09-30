import cron from "node-cron";
import { shouldEscalateL1 } from "../../packages/core/src/domain/ranking";

console.log("[Escalation] Worker started");

async function checkThresholds() {
  console.log("[Escalation] Polling for issues that meet thresholds...");
  // In reality: 
  // 1. Fetch unescalated Open issues
  // 2. Map to IssueSupportStats
  // 3. if (shouldEscalateL1(stats)) { sendPacket(); updateDB(); }
}

cron.schedule("*/30 * * * * *", () => {
  checkThresholds().catch(console.error);
});
