"use client";

import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import ConsultationCallView from "./ConsultationCallView";

interface ConsultationRoomProps {
  token: string;
  role: "doctor" | "patient";
  callType?: "video" | "audio" | "pstn";
  onLeave?: () => void;
}

export default function ConsultationRoom({
  token,
  role,
  callType = "video",
  onLeave,
}: ConsultationRoomProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      video={true}
      audio={true}
      options={{
        adaptiveStream: true,
        dynacast: true,
      }}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <ConsultationCallView myRole={role} callType={callType} onLeave={onLeave} />
    </LiveKitRoom>
  );
}
