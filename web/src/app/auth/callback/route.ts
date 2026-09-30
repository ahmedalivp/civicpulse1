import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);
    
    if (session?.user) {
      // Check if user has a profile with a handle set
      const { data: profile } = await supabase
        .from("users")
        .select("handle")
        .eq("id", session.user.id)
        .single();
        
      if (!profile?.handle) {
        return NextResponse.redirect(requestUrl.origin + "/onboarding");
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin + next);
}
