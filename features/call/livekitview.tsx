"use client";

import React, { useState, useEffect } from "react";
import ConsultationRoom from "./components/consultationRoom";

export default function LiveKitView() {
  const [token, setToken] = useState<string | null>(null);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log("Fetching LiveKit token...");
        const res = await fetch("http://localhost:7880/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "user-123",
            role: "doctor",
            consultationId: "consultation-abc-456",
          }),
        });

        if (!res.ok) {
          throw new Error(`Token server error: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Token response:", data);

        setToken(data.token);
        setLivekitUrl(data.livekitUrl || process.env.NEXT_PUBLIC_LIVEKIT_URL);
      } catch (err) {
        console.error("Failed to fetch token:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Connecting to consultation room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!token || !livekitUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to get token or LiveKit URL</p>
      </div>
    );
  }

  return <ConsultationRoom token={token} role="doctor" />;
}
