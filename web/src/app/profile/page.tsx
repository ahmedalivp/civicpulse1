import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile and locality
  const { data: profile } = await supabase
    .from("users")
    .select(`
      *,
      locality:localities(name)
    `)
    .eq("id", user.id)
    .single();

  const isVerifiedResident = profile?.is_verified_resident;
  const level = profile?.karma >= 1000 ? "Champion" : profile?.karma >= 200 ? "Advocate" : profile?.karma >= 50 ? "Neighbour" : "Newcomer";

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Profile</h1>
        <Link href="/" className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
          Back to Feed
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Identity Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              {isVerifiedResident ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  Verified Resident
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-500">
                  Unverified
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-status-acknowledged rounded-full shadow-inner flex items-center justify-center text-3xl font-black text-white uppercase border-4 border-white dark:border-gray-800">
                {profile?.handle?.substring(0,2) || "U"}
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">@{profile?.handle || "Not set"}</h2>
                <p className="text-gray-500 font-medium">Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'recently'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Karma</p>
                <div className="text-3xl font-black text-status-resolved">{profile?.karma || 0}</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Level</p>
                <div className="text-3xl font-black text-primary">{level}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-xl font-bold mb-6">Account Settings</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email Address</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button className="text-sm font-semibold text-primary hover:underline">Change</button>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Home Locality</p>
                  <p className="text-sm text-gray-500">{profile?.locality?.name || "Not selected"}</p>
                </div>
                <button className="text-sm font-semibold text-primary hover:underline">Update</button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Active Sessions</p>
                  <p className="text-sm text-gray-500">Manage devices logged into your account</p>
                </div>
                <button className="text-sm font-semibold text-primary hover:underline">View All</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700/50">
            <h3 className="font-bold text-lg mb-4">Security</h3>
            <form action="/auth/signout" method="post" className="mb-4">
              <button className="w-full py-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors">
                Sign out
              </button>
            </form>
            <button className="w-full py-3 border border-danger/30 text-danger hover:bg-danger/10 font-semibold rounded-xl transition-colors">
              Delete Account
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Account deletion is permanent. All your issues will remain public under "Deleted User" unless specified otherwise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
