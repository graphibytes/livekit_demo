"use client";

import { useEffect, useState } from "react";
import type { LocalParticipant } from "livekit-client";

interface Props {
  kind: "audioinput" | "videoinput" | "audiooutput";
  label: string;
  participant: LocalParticipant;
}

export default function DeviceSelector({ kind, label, participant }: Props) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  useEffect(() => {
    loadDevices();

    const handleDeviceChange = () => {
      loadDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [kind]);

  const loadDevices = async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const filtered = allDevices.filter((d) => d.kind === kind);
      setDevices(filtered);

      if (filtered.length > 0 && !selectedDevice) {
        setSelectedDevice(filtered[0].deviceId);
      }
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  };

  const handleChange = async (deviceId: string) => {
    setSelectedDevice(deviceId);

    try {
      if (kind === "audioinput") {
        await participant.setMicrophoneDevice(deviceId);
      } else if (kind === "videoinput") {
        await participant.setCameraDevice(deviceId);
      }
    } catch (error) {
      console.error(`Error switching ${kind}:`, error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">
        {label}
      </label>
      <select
        value={selectedDevice}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {devices.map((device, index) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `${label} ${index + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
}
