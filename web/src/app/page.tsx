import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import IssueMap from "@/components/Map";
import IssueCard from "@/components/IssueCard";

export const revalidate = 0;

export default async function FeedPage() {
  const supabase = await createClient();
  
  // Note: Mock user/locality fetching for Phase 3
  const { data: issues } = await supabase
    .from("issues")
    .select("*, users(handle), categories(names)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-28">
      {/* Premium Navbar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/20 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Civic<span className="text-primary">Pulse</span>
            </h1>
          </div>
          <div className="flex space-x-6 text-sm font-bold text-gray-500 dark:text-gray-400">
            <Link href="/pulse" className="hover:text-primary transition-colors">Pulse</Link>
            <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Header and Map */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Your Locality</p>
              <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Riverside Ward</h2>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
                System Live
              </span>
            </div>
          </div>
          
          <div className="rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-gray-700/50">
            <IssueMap issues={issues || []} />
          </div>
        </div>

        {/* Filters/Sort */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Trending', 'New', 'Top (Week)', 'Unresolved'].map((tab, i) => (
            <button key={tab} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${i === 0 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {issues && issues.length > 0 ? (
            issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No issues reported</h3>
              <p className="text-gray-500">Your locality is looking great! See something? Report it.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Link 
          href="/report" 
          className="group flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-full font-black shadow-2xl shadow-primary/40 transform hover:scale-105 active:scale-95 transition-all border border-white/20"
        >
          <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span className="tracking-wide">Report Issue</span>
        </Link>
      </div>
    </main>
  );
}
