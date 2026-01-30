import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { roomName } = await request.json();

    if (!roomName) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    // Call LiveKit Egress API to start recording
    // You'll need to install @livekit/server-sdk and configure it
    const response = await fetch(
      `${process.env.LIVEKIT_URL || "http://localhost:7880"}/twirp/livekit.Egress/StartRoomCompositeEgress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateEgressToken()}`,
        },
        body: JSON.stringify({
          room_name: roomName,
          layout: "grid",
          audio_only: false,
          video_only: false,
          custom_base_url: "",
          file: {
            filepath: `recordings/${roomName}-${Date.now()}.mp4`,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LiveKit Egress API error:", errorText);
      return NextResponse.json(
        { error: "Failed to start recording" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      egressId: data.egress_id,
      message: "Recording started successfully",
    });
  } catch (error) {
    console.error("Error starting recording:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateEgressToken() {
  // For now, return empty string
  // In production, generate a proper token using @livekit/server-sdk
  // const token = new AccessToken(apiKey, apiSecret, { ttl: "10m" });
  // token.addGrant({ roomRecord: true });
  // return await token.toJwt();
  return "";
}
