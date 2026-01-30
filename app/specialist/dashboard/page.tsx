"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { LocalUserChoices } from "@livekit/components-core";
import IncomingCallNotification from "@/features/call/components/IncomingCallNotification";
import PreJoinModal from "@/features/call/components/PreJoinModal";
import ConsultationRoom from "@/features/call/components/consultationRoom";

interface IncomingCall {
  id: string;
  patientId: string;
  patientName: string;
  callType: "video" | "audio" | "pstn";
  reason?: string;
  timestamp: Date;
}

export default function SpecialistDashboard() {
  const [incomingCalls, setIncomingCalls] = useState<IncomingCall[]>([]);
  const [activeCall, setActiveCall] = useState<{
    token: string;
    callId: string;
    callType: "video" | "audio" | "pstn";
  } | null>(null);
  const [showPreJoin, setShowPreJoin] = useState(false);
  const [pendingCall, setPendingCall] = useState<IncomingCall | null>(null);

  // Simulate incoming calls (in production, this would be SSE/WebSocket)
  useEffect(() => {
    // Example: Simulate an incoming call after 3 seconds
    const timer = setTimeout(() => {
      const mockCall: IncomingCall = {
        id: "call-123",
        patientId: "patient-456",
        patientName: "John Doe",
        callType: "video",
        reason: "Follow-up consultation",
        timestamp: new Date(),
      };
      setIncomingCalls((prev) => [...prev, mockCall]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptCall = async (call: IncomingCall) => {
    setPendingCall(call);
    setShowPreJoin(true);
    setIncomingCalls((prev) => prev.filter((c) => c.id !== call.id));
  };

  const handleDeclineCall = (callId: string) => {
    setIncomingCalls((prev) => prev.filter((c) => c.id !== callId));
    toast.error("Call declined");
  };

  const handleJoinCall = async (userChoices: LocalUserChoices) => {
    if (!pendingCall) return;

    try {
      // Fetch token from your backend
      const res = await fetch("http://localhost:4000/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userChoices.username || "specialist-001",
          role: "doctor",
          consultationId: pendingCall.id,
        }),
      });

      const data = await res.json();

      setActiveCall({
        token: data.token,
        callId: pendingCall.id,
        callType: pendingCall.callType,
      });
      setShowPreJoin(false);
      setPendingCall(null);
    } catch (error) {
      toast.error("Failed to join call");
      console.error(error);
    }
  };

  const handleLeaveCall = () => {
    setActiveCall(null);
  };

  // If in active call, show the call view
  if (activeCall) {
    return (
      <ConsultationRoom
        token={activeCall.token}
        role="doctor"
        callType={activeCall.callType}
        onLeave={handleLeaveCall}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Specialist Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your telehealth consultations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Online
                </span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                DS
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Today&apos;s Calls
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  12
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Avg Duration
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  24m
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Queue
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {incomingCalls.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Waiting Area */}
        <div className="mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Ready for Consultations
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                You're currently online and ready to receive calls. Incoming call
                notifications will appear at the bottom of your screen.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Incoming Call Notifications */}
      {incomingCalls.map((call) => (
        <IncomingCallNotification
          key={call.id}
          call={call}
          onAccept={() => handleAcceptCall(call)}
          onDecline={() => handleDeclineCall(call.id)}
        />
      ))}

      {/* PreJoin Modal */}
      {showPreJoin && pendingCall && (
        <PreJoinModal
          callType={pendingCall.callType}
          onJoin={handleJoinCall}
          onCancel={() => {
            setShowPreJoin(false);
            setPendingCall(null);
          }}
        />
      )}
    </div>
  );
}
