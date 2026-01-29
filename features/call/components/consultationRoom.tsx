"use client";

import { ControlBar, LiveKitRoom } from "@livekit/components-react";
import ConsultationCallView from "./ConsultationCallView";

interface ConsultationRoomProps {
  token: string;
  role: "doctor" | "patient";
}

export default function ConsultationRoom({
  token,
  role,
}: ConsultationRoomProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      video={{ resolution: { width: 640, height: 480 } }}
      audio={true}
      options={{
        adaptiveStream: true,
        dynacast: true,
      }}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <ConsultationCallView myRole={role} />
      
    </LiveKitRoom>
  );
}
