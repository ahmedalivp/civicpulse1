"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [handle, setHandle] = useState("");
  const [localityId, setLocalityId] = useState("");
  const [localities, setLocalities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadLocalities() {
      const { data } = await supabase.from("localities").select("id, name").eq("active", true);
      if (data) setLocalities(data);
    }
    loadLocalities();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("users").update({
      handle,
      locality_id: localityId,
    }).eq("id", user.id);

    if (error) {
      alert("Failed to save profile: " + error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-lg px-10 py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/50">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">Welcome to Civic Pulse</h1>
        <p className="text-gray-500 mb-8 font-medium">Let's get your profile set up so you can start reporting and supporting issues.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Public Handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
              placeholder="e.g. civic_hero_99"
              required
              minLength={3}
              maxLength={20}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              This is how you will appear publicly. Real names are not required.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Home Locality
            </label>
            <select
              value={localityId}
              onChange={(e) => setLocalityId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
            >
              <option value="" disabled>Select your neighborhood / ward...</option>
              {localities.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              You will mainly interact with issues in your home locality.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !handle || !localityId}
            className={`w-full py-3 mt-4 font-bold text-white rounded-xl shadow-lg transition-transform transform hover:scale-[1.02] active:scale-[0.98] ${
              loading || !handle || !localityId
                ? 'bg-primary/50 shadow-none cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-primary-dark shadow-primary/30 hover:shadow-primary/50'
            }`}
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
