"use client";

import {
  useTracks,
  useLocalParticipant,
  VideoTrack,
  AudioTrack,
  LayoutContextProvider,
  TrackToggle,
  DisconnectButton,
  useRoomContext,
  FocusLayout,
  ParticipantTile,
  GridLayout,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import CallControls from "./CallControls";

export default function ConsultationCallView({
  myRole,
}: {
  myRole: "doctor" | "patient";
}) {
  const { localParticipant } = useLocalParticipant();

  // Enable camera and microphone when participant joins
  useEffect(() => {
    if (!localParticipant) return;

    console.log("LocalParticipant:", localParticipant.identity);

    // Enable camera + mic
    localParticipant.setCameraEnabled(true);
    localParticipant.setMicrophoneEnabled(true);

    // If you want to disable later, you can call:
    // localParticipant.setCameraEnabled(false);
    // localParticipant.setMicrophoneEnabled(false);
  }, [localParticipant]);

  // ALL camera tracks (local + remote)
  const cameraTracks = useTracks([Track.Source.Camera]);
  console.log("Available camera tracks:", cameraTracks.length);

  // ALL microphone tracks
  const micTracks = useTracks([Track.Source.Microphone]);

  // LOCAL video track
  const localVideo = cameraTracks.find(
    (trackRef) => trackRef.participant === localParticipant,
  );

  // REMOTE video track
  const remoteVideo = cameraTracks.find(
    (trackRef) => trackRef.participant !== localParticipant,
  );

  // REMOTE audio track
  const remoteAudio = micTracks.find(
    (trackRef) => trackRef.participant !== localParticipant,
  );

  const room = useRoomContext();
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState<string>("");
  const [selectedVideoInput, setSelectedVideoInput] = useState<string>("");
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);

  // Fetch available media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter((d) => d.kind === "audioinput");
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };
    getDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    return () =>
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
  }, []);

  return (
    <LayoutContextProvider>
      <div className="relative flex flex-col h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Main Participant Area using FocusLayout */}
        <div className="flex-1 relative">
          <FocusLayout>
            <ParticipantTile />
          </FocusLayout>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-3">
            {/* Microphone Control */}
            <div className="relative">
              <button
                onClick={() => setShowAudioMenu(!showAudioMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/20"
                title="Microphone"
              >
                <Mic size={18} />
                <ChevronDown size={14} />
              </button>
              {showAudioMenu && audioDevices.length > 0 && (
                <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-white/20 rounded-md shadow-lg min-w-max z-50">
                  {audioDevices.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => {
                        setSelectedAudioInput(device.deviceId);
                        localParticipant?.setAudioInputDevice(device.deviceId);
                        setShowAudioMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                        selectedAudioInput === device.deviceId
                          ? "bg-blue-500"
                          : ""
                      }`}
                    >
                      {device.label ||
                        `Microphone ${audioDevices.indexOf(device) + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Camera Control */}
            <div className="relative">
              <button
                onClick={() => setShowVideoMenu(!showVideoMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/20"
                title="Camera"
              >
                <Video size={18} />
                <ChevronDown size={14} />
              </button>
              {showVideoMenu && videoDevices.length > 0 && (
                <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-white/20 rounded-md shadow-lg min-w-max z-50">
                  {videoDevices.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => {
                        setSelectedVideoInput(device.deviceId);
                        localParticipant?.setVideoInputDevice(device.deviceId);
                        setShowVideoMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                        selectedVideoInput === device.deviceId
                          ? "bg-blue-500"
                          : ""
                      }`}
                    >
                      {device.label ||
                        `Camera ${videoDevices.indexOf(device) + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Screen Share */}
            <button
              onClick={() =>
                localParticipant?.setScreenShareEnabled(
                  !room?.state?.screenShareEnabled,
                )
              }
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/20"
              title="Share Screen"
            >
              <Share2 size={18} />
            </button>

            {/* Disconnect Button */}
            <DisconnectButton className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500/20 hover:bg-red-500/30 transition-all border border-red-500/30 hover:border-red-500/50 text-red-400">
              <LogOut size={18} />
            </DisconnectButton>
          </div>
        </div>

        {/* <CallControls /> */}
      </div>
    </LayoutContextProvider>
  );
}
