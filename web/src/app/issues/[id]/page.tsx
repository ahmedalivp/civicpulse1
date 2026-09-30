import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import SupportButtons from "@/components/SupportButtons";

export default async function IssuePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: issue } = await supabase
    .from("issues")
    .select("*, users(handle)")
    .eq("id", params.id)
    .single();

  if (!issue) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl">
        <h1 className="text-2xl font-bold mb-2">Issue not found</h1>
        <Link href="/" className="text-primary hover:underline">Back to Feed</Link>
      </div>
    </div>
  );

  const statusColors: any = {
    "Processing": "bg-gray-100 text-gray-800 border-gray-200",
    "Open": "bg-primary/10 text-primary border-primary/20",
    "Acknowledged": "bg-status-acknowledged/10 text-status-acknowledged border-status-acknowledged/20",
    "In progress": "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20",
    "Resolved": "bg-success/10 text-success border-success/20",
  };

  const progress = Math.min((issue.support_count / 25) * 100, 100);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Sticky Header */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/20 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div className="font-bold text-gray-900 dark:text-white truncate">
            {issue.title}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          
          {/* Mock Processed Photo */}
          <div className="h-64 sm:h-96 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-400 font-medium">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Processed Photo Evidence</span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusColors[issue.status] || "bg-gray-100 text-gray-800"}`}>
                {issue.status}
              </span>
              {issue.severity === 'Hazard' && (
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-danger/10 text-danger border border-danger/20">
                  ⚠️ Hazard
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">{issue.title}</h1>
            
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold">
                {issue.users?.handle?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <span>Reported by <span className="font-bold text-gray-700 dark:text-gray-300">@{issue.users?.handle || "Anonymous"}</span></span>
                <span className="mx-2">·</span>
                <span>{format(new Date(issue.created_at), "MMM d, yyyy")}</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10 whitespace-pre-wrap">
              {issue.description}
            </p>

            {/* Support / Escalation Section */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">Escalation Progress</h3>
              <div className="flex justify-between text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">
                <span>{issue.support_count} Supporters</span>
                <span>25 Required</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-8">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-dark"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <SupportButtons issueId={issue.id} initialUpvotes={issue.support_count} initialAffected={issue.affected_count} />
            </div>

          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 p-6 sm:p-10">
          <h2 className="text-2xl font-bold mb-8">Public Timeline</h2>
          <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
            
            {/* Initial Report Event */}
            <div className="relative">
              <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-300 dark:border-gray-600"></div>
              <p className="text-xs font-bold text-gray-500 mb-1">{format(new Date(issue.created_at), "MMM d, yyyy · h:mm a")}</p>
              <h4 className="font-bold text-gray-900 dark:text-white">Issue Reported</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{issue.users?.handle} submitted the issue.</p>
            </div>

            {/* Dynamic Event (if escalated) */}
            {issue.status !== "Processing" && (
              <div className="relative">
                <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-4 border-primary"></div>
                <p className="text-xs font-bold text-primary mb-1">System Update</p>
                <h4 className="font-bold text-gray-900 dark:text-white">Moderation Passed</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Photos processed and blurred securely.</p>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </main>
  );
}
