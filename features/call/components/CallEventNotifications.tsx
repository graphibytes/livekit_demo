"use client";

import { useEffect } from "react";
import { useRoomContext, useDataChannel } from "@livekit/components-react";
import { RoomEvent, DataPacket_Kind, RemoteParticipant } from "livekit-client";
import { toast } from "react-hot-toast";
import { MessageCircle, UserPlus, UserMinus, Video, VideoOff } from "lucide-react";

export default function CallEventNotifications() {
  const room = useRoomContext();

  // Listen for chat messages
  useEffect(() => {
    const handleDataReceived = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
      kind?: DataPacket_Kind
    ) => {
      if (kind === DataPacket_Kind.RELIABLE) {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);

        try {
          const data = JSON.parse(message);

          // Check if it's a chat message
          if (data.type === "chat" || data.message) {
            const senderName = participant?.identity || participant?.name || "Unknown";

            toast.success(
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <div>
                  <p className="font-semibold text-sm">{senderName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {data.message || message.substring(0, 50)}
                  </p>
                </div>
              </div>,
              {
                duration: 3000,
                position: "top-right",
              }
            );
          }
        } catch (e) {
          // Not JSON, might be a plain text message
          console.log("Received data:", message);
        }
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  // Listen for participants joining
  useEffect(() => {
    const handleParticipantConnected = (participant: RemoteParticipant) => {
      const name = participant.identity || participant.name || "Someone";

      toast(
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-green-500" />
          <span className="text-sm">
            <strong>{name}</strong> joined the call
          </span>
        </div>,
        {
          duration: 3000,
          position: "bottom-left",
          icon: "👋",
        }
      );
    };

    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);

    return () => {
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
    };
  }, [room]);

  // Listen for participants leaving
  useEffect(() => {
    const handleParticipantDisconnected = (participant: RemoteParticipant) => {
      const name = participant.identity || participant.name || "Someone";

      toast(
        <div className="flex items-center gap-2">
          <UserMinus className="w-4 h-4 text-red-500" />
          <span className="text-sm">
            <strong>{name}</strong> left the call
          </span>
        </div>,
        {
          duration: 3000,
          position: "bottom-left",
        }
      );
    };

    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    return () => {
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    };
  }, [room]);

  // Listen for recording status changes
  useEffect(() => {
    const handleRecordingStatusChanged = (isRecording: boolean) => {
      if (isRecording) {
        toast.success(
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold">Recording started</span>
          </div>,
          {
            duration: 4000,
            position: "top-center",
          }
        );
      } else {
        toast(
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-400 rounded-full" />
            <span className="text-sm font-semibold">Recording stopped</span>
          </div>,
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }
    };

    room.on(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged);

    return () => {
      room.off(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged);
    };
  }, [room]);

  // Listen for track muted/unmuted events
  useEffect(() => {
    const handleTrackMuted = (publication: any, participant: RemoteParticipant) => {
      if (publication.kind === "video") {
        const name = participant.identity || participant.name || "Participant";
        toast(
          <div className="flex items-center gap-2">
            <VideoOff className="w-4 h-4 text-slate-500" />
            <span className="text-sm">{name} turned off camera</span>
          </div>,
          {
            duration: 2000,
            position: "bottom-left",
          }
        );
      }
    };

    const handleTrackUnmuted = (publication: any, participant: RemoteParticipant) => {
      if (publication.kind === "video") {
        const name = participant.identity || participant.name || "Participant";
        toast(
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-green-500" />
            <span className="text-sm">{name} turned on camera</span>
          </div>,
          {
            duration: 2000,
            position: "bottom-left",
          }
        );
      }
    };

    room.on(RoomEvent.TrackMuted, handleTrackMuted);
    room.on(RoomEvent.TrackUnmuted, handleTrackUnmuted);

    return () => {
      room.off(RoomEvent.TrackMuted, handleTrackMuted);
      room.off(RoomEvent.TrackUnmuted, handleTrackUnmuted);
    };
  }, [room]);

  return null; // This component only handles events, no UI
}
