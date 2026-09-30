"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SupportButtons({ issueId, initialUpvotes, initialAffected }: { issueId: string, initialUpvotes: number, initialAffected: number }) {
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  
  const handleSupport = async (type: 'upvote' | 'affected') => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please login to support issues.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("supports").insert({
      issue_id: issueId,
      user_id: user.id,
      type
    });

    if (error) {
      alert("Already supported or error occurred!");
    } else {
      setSupported(true);
      alert("Support recorded successfully! Ranking engine updated.");
    }
    setLoading(false);
  };

  if (supported) {
    return (
      <div className="bg-success/10 text-success font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
        Thanks for your support!
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button 
        onClick={() => handleSupport('upvote')}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white dark:bg-gray-800 border-2 border-primary/20 hover:bg-primary/5 hover:border-primary text-gray-900 dark:text-white font-bold rounded-2xl transition-all disabled:opacity-50"
      >
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        Upvote ({initialUpvotes})
      </button>

      <button 
        onClick={() => handleSupport('affected')}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/30 transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        I'm Affected Too ({initialAffected})
      </button>
    </div>
  );
}
