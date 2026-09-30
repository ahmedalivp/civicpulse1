import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function PulsePage() {
  const supabase = await createClient();
  
  const { count: openCount } = await supabase.from("issues").select("*", { count: "exact", head: true }).eq("status", "Open");
  const { count: resolvedCount } = await supabase.from("issues").select("*", { count: "exact", head: true }).eq("status", "Resolved");
  const { count: totalCount } = await supabase.from("issues").select("*", { count: "exact", head: true });

  const resolutionRate = totalCount && resolvedCount ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/20 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Pulse</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Live Accountability</p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">Riverside Ward</h1>
          <p className="text-lg text-gray-500">Real-time metrics on how efficiently local issues are being resolved.</p>
        </div>
        
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-status-open mb-1">{openCount || 0}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open Issues</div>
          </div>
          
          <div className="bg-gradient-to-br from-success to-emerald-600 p-6 rounded-3xl shadow-lg shadow-success/30 flex flex-col items-center justify-center text-center text-white transform hover:scale-105 transition-transform">
            <div className="text-4xl font-black mb-1">{resolvedCount || 0}</div>
            <div className="text-xs font-bold text-white/80 uppercase tracking-wider">Resolved</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-primary mb-1">14<span className="text-2xl">d</span></div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Median Fix Time</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-status-in-progress mb-1">{resolutionRate}%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resolution Rate</div>
          </div>
        </div>
        
        {/* Scoreboard */}
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold mb-8">Authority Scoreboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Authority</th>
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received</th>
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved</th>
                  <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="py-5 font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">R</div>
                    Riverside Public Works
                  </td>
                  <td className="py-5 font-semibold text-gray-600 dark:text-gray-300">12</td>
                  <td className="py-5 font-semibold text-gray-600 dark:text-gray-300">4</td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700 max-w-[150px]">
                        <div className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full" style={{ width: '33%' }}></div>
                      </div>
                      <span className="text-sm font-bold text-gray-500">33%</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="py-5 font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">W</div>
                    Water Board
                  </td>
                  <td className="py-5 font-semibold text-gray-600 dark:text-gray-300">5</td>
                  <td className="py-5 font-semibold text-gray-600 dark:text-gray-300">4</td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700 max-w-[150px]">
                        <div className="bg-gradient-to-r from-success to-emerald-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <span className="text-sm font-bold text-gray-500">80%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-6 text-center">
            Scores are based on Civic Pulse reports and may not reflect official statistics. Authorities are ranked dynamically.
          </p>
        </div>
      </div>
    </div>
  );
}
