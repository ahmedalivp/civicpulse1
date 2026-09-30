"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setMessage("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-4 text-gray-900 dark:text-gray-100"
        onSubmit={handleLogin}
      >
        <h1 className="text-3xl font-bold text-center mb-6">Sign In to Civic Pulse</h1>
        <label className="text-md font-semibold" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-gray-300 dark:border-gray-700 mb-6"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="you@example.com"
          required
        />
        <button
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md transition-colors"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
        {message && (
          <p className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 text-center rounded-md">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
