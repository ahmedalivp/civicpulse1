import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: flags } = await supabase.from("flags").select("*").limit(50);
  const { data: escalations } = await supabase.from("escalations").select("*").limit(50);
  const { count: issuesCount } = await supabase.from("issues").select("*", { count: 'exact', head: true });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin</h1>
        </div>
        
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">
            Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-colors">
            Moderation Queue
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-colors">
            Authorities
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-colors">
            Thresholds
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Overview</h1>
          <div className="flex gap-4">
            <Link href="/" className="px-6 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              Exit Admin
            </Link>
          </div>
        </header>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-gray-500 font-bold mb-2 uppercase text-sm">Total Issues</h3>
            <p className="text-4xl font-black">{issuesCount || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 shadow-lg shadow-primary/20 text-white">
            <h3 className="text-white/80 font-bold mb-2 uppercase text-sm">Active Escalations</h3>
            <p className="text-4xl font-black">{escalations?.length || 0}</p>
          </div>
          <div className="bg-danger/10 border border-danger/20 rounded-3xl p-6 text-danger">
            <h3 className="text-danger/80 font-bold mb-2 uppercase text-sm">Flags to Review</h3>
            <p className="text-4xl font-black">{flags?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Moderation Queue */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Moderation Queue</h2>
              <button className="text-sm font-bold text-primary hover:underline">View All</button>
            </div>
            
            {(!flags || flags.length === 0) ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 font-medium">Queue is clear! Great job.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flags.map((f: any) => (
                  <div key={f.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="inline-block px-2 py-1 bg-danger/10 text-danger text-xs font-bold rounded mb-1">{f.reason}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{f.note || "No additional notes."}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-success/10 text-success text-sm font-bold rounded-lg hover:bg-success/20">Approve</button>
                      <button className="px-3 py-1.5 bg-danger/10 text-danger text-sm font-bold rounded-lg hover:bg-danger/20">Hide</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Escalation Console */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Escalations</h2>
              <button className="text-sm font-bold text-primary hover:underline">Console</button>
            </div>

            {(!escalations || escalations.length === 0) ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 font-medium">No recent escalations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {escalations.map((e: any) => (
                  <div key={e.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900 dark:text-white">Issue #{e.issue_id?.substring(0,8)}</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">Level {e.level}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Authority ID: {e.authority_id}</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{e.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
