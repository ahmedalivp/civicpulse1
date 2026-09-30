import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function DemoPage() {
  const supabase = await createClient();
  const { data: issues } = await supabase.from("issues").select("*").order("created_at", { ascending: false }).limit(10);

  async function fastForward(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    
    const supabaseServer = await createClient();
    await supabaseServer.from("issues").update({ status }).eq("id", id);
    revalidatePath("/demo");
    revalidatePath("/");
    revalidatePath("/pulse");
    redirect("/demo");
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Demo Control Panel</h1>
      <p className="text-gray-500 mb-8">Fast-forward issue lifecycles for testing.</p>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-4 font-semibold text-sm">Issue</th>
              <th className="p-4 font-semibold text-sm">Current Status</th>
              <th className="p-4 font-semibold text-sm">Fast-Forward To</th>
            </tr>
          </thead>
          <tbody>
            {issues?.map(issue => (
              <tr key={issue.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-4 font-medium">{issue.title}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700">
                    {issue.status}
                  </span>
                </td>
                <td className="p-4">
                  <form action={fastForward} className="flex space-x-2">
                    <input type="hidden" name="id" value={issue.id} />
                    <select name="status" className="bg-inherit border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm">
                      <option value="Open">Open</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm font-semibold transition-colors">
                      Set
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
