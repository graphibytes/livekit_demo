"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorScreen({
  title = "Connection Error",
  message,
  onRetry,
}: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f33d0b] to-[#e9552b] hover:bg-[#e9552b]/90 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Troubleshooting:</strong>
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1 text-left">
            <li>• Check your internet connection</li>
            <li>• Ensure your browser has camera/microphone permissions</li>
            <li>• Try refreshing the page</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
