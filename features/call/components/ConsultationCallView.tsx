"use client";

import {
  VideoConference,
  AudioConference,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { ConnectionState } from "livekit-client";
import { useEffect, useState } from "react";
import CallMetrics from "./CallMetrics";
import CallEventNotifications from "./CallEventNotifications";
import RecordingControls from "./RecordingControls";

interface Props {
  myRole: "doctor" | "patient";
  callType?: "video" | "audio" | "pstn";
  onLeave?: () => void;
}

export default function ConsultationCallView({
  myRole,
  callType = "video",
  onLeave,
}: Props) {
  const room = useRoomContext();
  const [isConnected, setIsConnected] = useState(
    () => room.state === ConnectionState.Connected
  );

  useEffect(() => {
    // Listen for connection state changes
    const handleConnectionStateChange = (state: ConnectionState) => {
      setIsConnected(state === ConnectionState.Connected);
    };

    room.on("connectionStateChanged", handleConnectionStateChange);

    return () => {
      room.off("connectionStateChanged", handleConnectionStateChange);
    };
  }, [room]);

  // Show loading state while connecting
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Connecting to call...</p>
        </div>
      </div>
    );
  }

  // Use AudioConference for audio/pstn calls, VideoConference for video calls
  if (callType === "audio" || callType === "pstn") {
    return (
      <>
        <RoomAudioRenderer />
        <CallEventNotifications />
        <div className="relative h-full">
          <CallMetrics />
          <AudioConference />
          {/* Recording controls for doctors/specialists */}
          {myRole === "doctor" && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50">
              <RecordingControls />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <RoomAudioRenderer />
      <CallEventNotifications />
      <div className="relative h-full">
        <CallMetrics />
        <VideoConference />
        {/* Recording controls for doctors/specialists */}
        {myRole === "doctor" && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50">
            <RecordingControls />
          </div>
        )}
      </div>
    </>
  );
}
