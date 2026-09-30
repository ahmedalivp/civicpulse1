import { createClient } from "@/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: flags } = await supabase.from("flags").select("*").limit(50);
  const { data: escalations } = await supabase.from("escalations").select("*").limit(50);

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            Moderation Queue
            <span className="bg-danger/10 text-danger text-sm px-2 py-1 rounded-full">{flags?.length || 0}</span>
          </h2>
          {(!flags || flags.length === 0) ? (
            <p className="text-gray-500">Queue is clear.</p>
          ) : (
            <ul className="space-y-2">
              {flags.map((f: any) => (
                <li key={f.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                  <span className="font-semibold text-danger">{f.reason}</span>: {f.note}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            Escalations
            <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">{escalations?.length || 0}</span>
          </h2>
          {(!escalations || escalations.length === 0) ? (
            <p className="text-gray-500">No recent escalations.</p>
          ) : (
            <ul className="space-y-2">
              {escalations.map((e: any) => (
                <li key={e.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                  {e.status} (Level {e.level}) to Auth {e.authority_id}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
