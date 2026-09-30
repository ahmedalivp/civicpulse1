import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function IssueCard({ issue }: { issue: any }) {
  const statusColors: any = {
    "Processing": "bg-gray-100 text-gray-800",
    "Open": "bg-primary/10 text-primary border-primary/20",
    "Acknowledged": "bg-status-acknowledged/10 text-status-acknowledged border-status-acknowledged/20",
    "In progress": "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20",
    "Resolved": "bg-success/10 text-success border-success/20",
  };

  const progress = Math.min((issue.support_count / 25) * 100, 100);

  return (
    <Link href={`/issues/${issue.id}`} className="block group">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
        
        {/* Mock Image Header */}
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden group-hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-400 dark:text-gray-500 font-medium">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Processed Photo Placeholder</span>
          </div>
          
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[issue.status] || "bg-gray-100 text-gray-800"}`}>
              {issue.status}
            </span>
          </div>

          {issue.severity === 'Hazard' && (
            <div className="absolute top-4 right-4 bg-danger text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-danger/50">
              URGENT HAZARD
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{issue.title}</h3>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
              <span>{issue.support_count} / 25 supporters needed</span>
              <span>{Math.round(progress)}% to Escalate</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDistanceToNow(new Date(issue.created_at))} ago</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="font-bold text-gray-600 dark:text-gray-300">Support</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
