import { createClient } from "@/utils/supabase/server";

export default async function PulsePage() {
  const supabase = await createClient();
  
  // Quick metrics
  const { count: openCount } = await supabase.from("issues").select("*", { count: "exact", head: true }).eq("status", "Open");
  const { count: resolvedCount } = await supabase.from("issues").select("*", { count: "exact", head: true }).eq("status", "Resolved");

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-2">Locality Pulse</h1>
      <p className="text-gray-500 mb-8 text-lg">Live accountability metrics for Riverside Ward</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-5xl font-black text-status-open mb-2">{openCount || 0}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Open Issues</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-5xl font-black text-status-resolved mb-2">{resolvedCount || 0}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Resolved</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-5xl font-black text-primary mb-2">14d</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Median Resolution Time</div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Authority Scoreboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-sm font-semibold text-gray-500">Authority</th>
                <th className="pb-3 text-sm font-semibold text-gray-500">Issues Received</th>
                <th className="pb-3 text-sm font-semibold text-gray-500">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 font-medium">Riverside Public Works</td>
                <td className="py-4">0</td>
                <td className="py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-[200px]">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
