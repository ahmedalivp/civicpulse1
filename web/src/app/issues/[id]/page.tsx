import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";

export default async function IssuePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: issue } = await supabase
    .from("issues")
    .select("*, users(handle)")
    .eq("id", params.id)
    .single();

  if (!issue) return <div className="p-12 text-center">Issue not found</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-extrabold">{issue.title}</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {issue.status}
          </span>
        </div>
        
        <p className="text-gray-500 mb-8 text-sm">
          Reported by {issue.users?.handle || "Anonymous"} · {formatDistanceToNow(new Date(issue.created_at))} ago
        </p>

        <div className="prose dark:prose-invert max-w-none mb-12">
          <p>{issue.description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex space-x-4">
            <button className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl font-bold text-primary">{issue.support_count}</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Upvotes</span>
            </button>
            <button className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl font-bold text-orange-500">{issue.affected_count}</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Affected Too</span>
            </button>
          </div>
          
          <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform hover:scale-105">
            Support this Issue
          </button>
        </div>
      </div>
    </main>
  );
}
