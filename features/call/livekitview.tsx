"use client";

import React, { useState, useEffect } from "react";
import ConsultationRoom from "./components/consultationRoom";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import { fetchToken } from "./service";


export default function LiveKitView() {
  const [token, setToken] = useState<string | null>(null);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  // useEffect to fetch token on component mount
  useEffect(() => {
    const getToken = async () => {
      setLoading(true);
      setError(null);
      try {
        const { token, livekitUrl } = await fetchToken(
          "user-123",
          "doctor",
          "consultation-abc-456",
        );
        setToken(token);
        setLivekitUrl(livekitUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    getToken();
  }, []);

  // Loading state indicator
  if (loading) {
    return <LoadingScreen message="Connecting to consultation room" />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Connection Failed"
        message={error}
        onRetry={fetchToken}
      />
    );
  }

  if (!token || !livekitUrl) {
    return (
      <ErrorScreen
        title="Setup Error"
        message="Failed to initialize consultation session. Please try again."
        onRetry={fetchToken}
      />
    );
  }

  return <ConsultationRoom token={token} role="doctor" />;
}
