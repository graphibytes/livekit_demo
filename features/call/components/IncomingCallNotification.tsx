"use client";

import { useEffect, useState } from "react";
import { Phone, PhoneOff, Video, Mic, User } from "lucide-react";

interface IncomingCall {
  id: string;
  patientId: string;
  patientName: string;
  callType: "video" | "audio" | "pstn";
  reason?: string;
  timestamp: Date;
}

interface Props {
  call: IncomingCall;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallNotification({
  call,
  onAccept,
  onDecline,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  const getCallIcon = () => {
    switch (call.callType) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "audio":
        return <Mic className="w-5 h-5" />;
      case "pstn":
        return <Phone className="w-5 h-5" />;
    }
  };

  const getCallTypeLabel = () => {
    switch (call.callType) {
      case "video":
        return "Video Call";
      case "audio":
        return "Audio Call";
      case "pstn":
        return "Phone Call";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-w-md">
        {/* Header with timer */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              {getCallIcon()}
              <span className="font-semibold">{getCallTypeLabel()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{timeLeft}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {call.patientName}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Patient ID: {call.patientId}
              </p>
              {call.reason && (
                <div className="mt-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Reason
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {call.reason}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 animate-pulse"
            >
              <Phone className="w-4 h-4" />
              Accept
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
