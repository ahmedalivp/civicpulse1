"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setMessage("You must accept the terms and confirm your age.");
      return;
    }

    setLoading(true);
    setMessage("");
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the magic login link!");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-status-acknowledged/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-status-resolved/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md px-8 py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
            Civic <span className="text-primary">Pulse</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Join your locality. Report issues. Get them fixed.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
              Email address
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input 
              type="checkbox" 
              id="terms" 
              className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              I am at least 16 years old and I accept the <a href="#" className="text-primary hover:underline">Terms of Service</a>, <a href="#" className="text-primary hover:underline">Privacy Policy</a>, and <a href="#" className="text-primary hover:underline">Community Guidelines</a>.
            </label>
          </div>

          <button
            className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-2 ${
              loading || !termsAccepted 
                ? 'bg-primary/50 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-primary to-primary-dark shadow-primary/30 hover:shadow-primary/50'
            }`}
            disabled={loading || !termsAccepted}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Magic Link...
              </span>
            ) : (
              "Continue with Email"
            )}
          </button>
          
          {message && (
            <div className={`mt-2 p-3 text-sm rounded-lg text-center ${message.includes('Check') ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
}
