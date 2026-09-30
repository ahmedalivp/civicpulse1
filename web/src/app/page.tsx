import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 0;

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: issues } = await supabase
    .from("issues")
    .select("*, users(handle)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Civic <span className="text-primary">Pulse</span>
          </h1>
          <div className="flex space-x-4 text-sm font-semibold">
            <Link href="/profile" className="text-gray-600 hover:text-primary transition-colors">Profile</Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Riverside Feed</h2>
        </div>

        {issues && issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{issue.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {issue.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {issue.description}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  <span>{formatDistanceToNow(new Date(issue.created_at))} ago</span>
                  <span>{issue.support_count} supporters</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p>No issues reported in your locality yet.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <Link 
          href="/report" 
          className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/30 flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <span>Report Issue</span>
        </Link>
      </div>
    </main>
  );
}
