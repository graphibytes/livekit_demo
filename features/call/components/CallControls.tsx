"use client";

import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { RoomEvent } from "livekit-client";

// Lucide icons
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MonitorX,
  PhoneOff,
  CircleDot,
} from "lucide-react";

export default function CallControls() {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Detect active speaker
  useEffect(() => {
    if (!room) return;

    const handler = (speakers: any[]) => {
      const meSpeaking = speakers.some(
        (s) => s.identity === localParticipant?.identity,
      );
      setIsSpeaking(meSpeaking);
    };

    room.on(RoomEvent.ActiveSpeakersChanged, handler);
    return () => {
      room.off(RoomEvent.ActiveSpeakersChanged, handler);
    };
  }, [room, localParticipant]);

  const toggleMic = async () => {
    const enabled = localParticipant.isMicrophoneEnabled;
    await localParticipant.setMicrophoneEnabled(!enabled);
  };

  const toggleCamera = async () => {
    const enabled = localParticipant.isCameraEnabled;
    await localParticipant.setCameraEnabled(!enabled);
  };

  const toggleScreenShare = async () => {
    const enabled = localParticipant.isScreenShareEnabled;
    await localParticipant.setScreenShareEnabled(!enabled);
    setIsScreenSharing(!enabled);
  };

  const startRecording = async () => {
    if (!room) return;
    await fetch("http://localhost:5000/start-recording", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName: room.name }),
    });
    setIsRecording(true);
    // Notify participants (simple alert, could be replaced with UI banner)
    alert("Recording has started!");
  };

  const leaveCall = async () => {
    await room.disconnect();
  };

  // Tooltip wrapper
  const Tooltip = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="relative group">
      {children}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
        {label}
      </span>
    </div>
  );

  return (
    <div className="absolute bottom-4 bg-gray-800 p-4 rounded-4xl shadow-2xl left-1/2 -translate-x-1/2 flex gap-4">
      {/* Mic Button */}
      <Tooltip
        label={localParticipant.isMicrophoneEnabled ? "Mute Mic" : "Unmute Mic"}
      >
        <button
          onClick={toggleMic}
          className={`p-3 rounded-full bg-gray-700 hover:bg-gray-800 transition ${
            isSpeaking ? "ring-4 ring-orange-400" : ""
          }`}
        >
          {localParticipant.isMicrophoneEnabled ? (
            <Mic className="text-white w-6 h-6" />
          ) : (
            <MicOff className="text-white w-6 h-6" />
          )}
        </button>
      </Tooltip>

      {/* Camera Button */}
      <Tooltip
        label={
          localParticipant.isCameraEnabled
            ? "Turn Off Camera"
            : "Turn On Camera"
        }
      >
        <button
          onClick={toggleCamera}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-800 transition"
        >
          {localParticipant.isCameraEnabled ? (
            <Video className="text-white w-6 h-6" />
          ) : (
            <VideoOff className="text-white w-6 h-6" />
          )}
        </button>
      </Tooltip>

      {/* Screen Share Button */}
      <Tooltip
        label={isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
      >
        <button
          onClick={toggleScreenShare}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-800 transition"
        >
          {isScreenSharing ? (
            <MonitorX className="text-white w-6 h-6" />
          ) : (
            <ScreenShare className="text-white w-6 h-6" />
          )}
        </button>
      </Tooltip>

      {/* Recording Button */}
      <Tooltip label={isRecording ? "Recording Active" : "Start Recording"}>
        <button
          onClick={startRecording}
          className={`p-3 rounded-full transition ${
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-700 hover:bg-gray-800"
          }`}
        >
          <CircleDot className="text-white w-6 h-6" />
        </button>
      </Tooltip>

      {/* Leave Call Button */}
      <Tooltip label="Leave Call">
        <button
          onClick={leaveCall}
          className="p-3 rounded-full bg-red-500 hover:bg-red-800 transition"
        >
          <PhoneOff className="text-white w-6 h-6" />
        </button>
      </Tooltip>
    </div>
  );
}
