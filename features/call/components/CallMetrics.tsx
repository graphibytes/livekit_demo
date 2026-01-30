"use client";

import { useEffect, useState } from "react";
import {
  useRoomContext,
  useRemoteParticipants,
  useConnectionQualityIndicator,
  useLocalParticipant,
} from "@livekit/components-react";
import { ConnectionQuality, RoomEvent } from "livekit-client";
import { Users, Wifi, WifiOff, Circle } from "lucide-react";

export default function CallMetrics() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const connectionQuality = useConnectionQualityIndicator({
    participant: localParticipant,
  });

  const [duration, setDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Track call duration
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitor recording state
  useEffect(() => {
    const handleRecordingStatusChanged = (recording: boolean) => {
      setIsRecording(recording);
    };

    room.on(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged);

    return () => {
      room.off(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged);
    };
  }, [room]);

  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get network quality info
  const getNetworkQuality = () => {
    switch (connectionQuality) {
      case ConnectionQuality.Excellent:
        return {
          label: "Excellent",
          color: "text-green-500",
          bgColor: "bg-green-500/20",
          icon: <Wifi className="w-4 h-4" />,
        };
      case ConnectionQuality.Good:
        return {
          label: "Good",
          color: "text-green-500",
          bgColor: "bg-green-500/20",
          icon: <Wifi className="w-4 h-4" />,
        };
      case ConnectionQuality.Poor:
        return {
          label: "Poor",
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/20",
          icon: <Wifi className="w-4 h-4" />,
        };
      case ConnectionQuality.Lost:
        return {
          label: "Lost",
          color: "text-red-500",
          bgColor: "bg-red-500/20",
          icon: <WifiOff className="w-4 h-4" />,
        };
      default:
        return {
          label: "Unknown",
          color: "text-slate-400",
          bgColor: "bg-slate-500/20",
          icon: <Wifi className="w-4 h-4" />,
        };
    }
  };

  const networkInfo = getNetworkQuality();
  const totalParticipants = remoteParticipants.length + 1; // +1 for local participant

  return (
    <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none">
      <div className="flex items-center justify-between">
        {/* Left side: Recording & Duration */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/90 backdrop-blur-sm rounded-lg shadow-lg animate-pulse">
              <Circle className="w-3 h-3 fill-white text-white" />
              <span className="text-white text-sm font-semibold">REC</span>
            </div>
          )}

          {/* Call Duration */}
          <div className="px-3 py-2 bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
            <span className="text-white text-sm font-mono font-semibold">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Right side: Participants & Network */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Participant Count */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-semibold">
              {totalParticipants}
            </span>
          </div>

          {/* Network Quality */}
          <div
            className={`flex items-center gap-2 px-3 py-2 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 ${networkInfo.bgColor}`}
          >
            <span className={networkInfo.color}>{networkInfo.icon}</span>
            <span className={`text-sm font-semibold ${networkInfo.color}`}>
              {networkInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
