import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile from public.users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">Handle</label>
            <p className="font-medium">{profile?.handle || "Not set"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Karma</label>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-status-resolved/10 text-status-resolved font-semibold">
              {profile?.karma || 0} points
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <form action="/auth/signout" method="post">
            <button className="text-danger hover:underline font-medium">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
