"use client";

import { PreJoin } from "@livekit/components-react";
import "@livekit/components-styles";
import { LocalUserChoices } from "@livekit/components-core";

interface Props {
  callType: "video" | "audio" | "pstn";
  onJoin: (userChoices: LocalUserChoices) => void;
  onCancel: () => void;
}

export default function PreJoinModal({ callType, onJoin, onCancel }: Props) {
  const handleSubmit = (values: LocalUserChoices) => {
    onJoin(values);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {callType === "video" ? "Video Call Setup" : callType === "audio" ? "Audio Call Setup" : "Phone Call Setup"}
            </h2>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* LiveKit PreJoin Component */}
        <div className="p-6">
          <PreJoin
            onSubmit={handleSubmit}
            defaults={{
              username: "",
              videoEnabled: callType === "video",
              audioEnabled: true,
            }}
            joinLabel="Join Call"
            micLabel="Microphone"
            camLabel="Camera"
            userLabel="Your Name"
          />
        </div>

        {/* Cancel Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onCancel}
            className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
