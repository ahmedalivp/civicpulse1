import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/20 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">CivicPulse</h1>
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">Back to Feed</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
            Empowering communities to fix local issues, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">together.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Civic Pulse is a hyperlocal platform where residents report problems, the community validates them, and popular issues are automatically escalated to the responsible local authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">1. Report</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Snap a photo of a pothole, broken streetlight, or hazard. We automatically blur faces for privacy.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">2. Validate</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Neighbors upvote the issue. The more verified local support it gets, the higher it ranks.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">3. Escalate</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Once a threshold is met, the system automatically dispatches a formal report to the exact responsible authority.</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-6">Ready to make a difference?</h2>
            <Link href="/report" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-primary/50 transition-all hover:-translate-y-1">
              Start Reporting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
