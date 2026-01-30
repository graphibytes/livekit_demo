import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { roomName, egressId } = await request.json();

    if (!egressId && !roomName) {
      return NextResponse.json(
        { error: "Egress ID or room name is required" },
        { status: 400 }
      );
    }

    // For now, return a mock response
    // In production, you would call LiveKit Egress API to stop recording:
    // const response = await fetch(
    //   `${process.env.LIVEKIT_URL}/twirp/livekit.Egress/StopEgress`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${generateEgressToken()}`,
    //     },
    //     body: JSON.stringify({
    //       egress_id: egressId,
    //     }),
    //   }
    // );

    return NextResponse.json({
      success: true,
      message: "Recording stopped successfully",
    });
  } catch (error) {
    console.error("Error stopping recording:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
