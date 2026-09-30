import cron from "node-cron";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in worker");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Image Pipeline Worker starting...");

async function processPendingImages() {
  console.log("[Image Pipeline] Polling for 'pending' images...");
  
  // 1. Fetch pending images
  const { data: images, error } = await supabase
    .from("issue_images")
    .select("id, issue_id, processing_status")
    .eq("processing_status", "pending")
    .limit(10);

  if (error) {
    console.error("Error fetching images:", error);
    return;
  }

  if (!images || images.length === 0) {
    return;
  }

  console.log(`Found ${images.length} pending images. Processing...`);

  for (const img of images) {
    // 2. Mock processing (Exif stripping, Face blurring logic goes here)
    // For MVP P1, we simulate processing delay and mark as ready.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await supabase
      .from("issue_images")
      .update({ processing_status: "ready", faces_blurred: true })
      .eq("id", img.id);

    // 3. Mark parent issue as Open if all its images are ready
    const { data: issue } = await supabase
      .from("issues")
      .select("id, status")
      .eq("id", img.issue_id)
      .single();

    if (issue && issue.status === "Processing") {
      console.log(`Marking issue ${issue.id} as Open`);
      await supabase
        .from("issues")
        .update({ status: "Open" })
        .eq("id", issue.id);
    }
  }
}

// Run every 15 seconds
cron.schedule("*/15 * * * * *", () => {
  processPendingImages().catch(console.error);
});
