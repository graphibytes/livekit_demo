"use client";

export default function LoadingScreen({ message = "Connecting..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* Animated rings */}
          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-t-blue-800 border-r-[#e9552b] border-b-blue-800 border-l-[#e9552b] rounded-full animate-spin" />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#df220d] to-[#e9552b] rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {message}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Please wait while we set things up
        </p>

        {/* Dots animation */}
        <div className="flex gap-2 justify-center mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-[#e9552b] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
