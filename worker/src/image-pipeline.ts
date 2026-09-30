import cron from "node-cron";

console.log("Worker starting...");

// Mock image processing pipeline
async function processPendingImages() {
  console.log("[Worker] Polling for 'Processing' issues...");
  // In reality: Fetch issues where status = 'Processing'
  // Pass image to @civicpulse/core/adapters FaceDetectionService
  // Update status to 'Open'
}

// Every 10 seconds for demo
cron.schedule("*/10 * * * * *", () => {
  processPendingImages().catch(console.error);
});
