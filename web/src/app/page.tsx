import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Civic <span className="text-primary">Pulse</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Report local problems. Get them resolved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Report an Issue
          </button>
          <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-700">
            View Local Feed
          </button>
        </div>

        <div className="pt-12">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm text-sm font-medium text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-status-open animate-pulse"></span>
            <span>Live in Riverside Ward</span>
          </div>
        </div>
      </div>
    </main>
  );
}
