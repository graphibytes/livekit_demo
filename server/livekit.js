import { AccessToken } from "livekit-server-sdk";

export async function generateLiveKitToken({ roomName, identity, role }) {
  try {
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity,
        metadata: JSON.stringify({ role }),
        ttl: 60 * 30, // 30 minutes
      },
    );

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const jwtToken = await token.toJwt();
    console.log(
      "Generated JWT type:",
      typeof jwtToken,
      "length:",
      jwtToken?.length || 0,
    );
    return jwtToken;
  } catch (err) {
    console.error("Token generation error:", err);
    throw err;
  }
}
