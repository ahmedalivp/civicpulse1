import cron from "node-cron";
import { shouldEscalateL1, IssueSupportStats } from "../../packages/core/src/domain/ranking";
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

console.log("[Escalation] Worker started");

async function checkThresholds() {
  console.log("[Escalation] Polling for issues that meet thresholds...");
  
  // 1. Fetch unescalated Open issues
  const { data: issues, error } = await supabase
    .from("issues")
    .select("id, support_count, verified_supporter_count, created_at, status")
    .eq("status", "Open")
    .is("escalation_level", null);

  if (error || !issues) {
    console.error("Failed to fetch issues:", error);
    return;
  }

  // 2. Iterate and check
  for (const issue of issues) {
    const ageHours = (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60);

    const stats: IssueSupportStats = {
      scoreS: issue.support_count,
      verifiedV: issue.verified_supporter_count || (issue.support_count * 0.5), // Mocking verified fraction for MVP
      activeUsersA: 1000, // Mock Active Locality Users
      ageHours,
      daysOpen: ageHours / 24,
      inLocalityFraction: 0.8 // Mock
    };

    if (shouldEscalateL1(stats)) {
      console.log(`[Escalation] Escaling Issue ${issue.id} to L1`);
      
      // Update the DB
      await supabase
        .from("issues")
        .update({ 
          escalation_level: 'L1', 
          status: 'Acknowledged' // We'll move it to acknowledged for demo purposes
        })
        .eq("id", issue.id);

      // We would also insert an escalation event and email the authority here
      await supabase
        .from("escalation_events")
        .insert({
          escalation_id: 'mock-id',
          event: 'queued',
          payload: { issue_id: issue.id, level: 'L1' }
        }).select().maybeSingle(); // We use maybeSingle to swallow errors on missing FKs since it's an MVP mock
    }
  }
}

// Every 30 seconds
cron.schedule("*/30 * * * * *", () => {
  checkThresholds().catch(console.error);
});
