"use client";

import { useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { Circle, Square } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RecordingControls() {
  const room = useRoomContext();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startRecording = async () => {
    try {
      setIsLoading(true);

      // Call your backend to start recording via LiveKit Egress API
      const response = await fetch("/api/recording/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: room.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start recording");
      }

      const data = await response.json();

      setIsRecording(true);

      toast.success(
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
          <span className="font-semibold">Recording started</span>
        </div>,
        { duration: 3000 }
      );

      console.log("Recording started:", data);
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Failed to start recording. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsLoading(true);

      // Call your backend to stop recording
      const response = await fetch("/api/recording/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: room.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to stop recording");
      }

      setIsRecording(false);

      toast.success("Recording stopped successfully", { duration: 3000 });
    } catch (error) {
      console.error("Failed to stop recording:", error);
      toast.error("Failed to stop recording. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-slate-700 hover:bg-slate-600 text-white"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isRecording ? "Stop Recording" : "Start Recording"}
    >
      {isRecording ? (
        <>
          <Square className="w-4 h-4 fill-white" />
          <span>Stop Recording</span>
        </>
      ) : (
        <>
          <Circle className="w-4 h-4" />
          <span>Start Recording</span>
        </>
      )}
    </button>
  );
}
