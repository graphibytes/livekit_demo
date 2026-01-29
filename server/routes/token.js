import { Router } from "express";
import { generateLiveKitToken } from "../livekit.js"; // note .js extension

const router = Router();

router.post("/token", async (req, res) => {
  const { userId, role, consultationId } = req.body;

  if (!userId || !role || !consultationId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const roomName = `consultation-${consultationId}`;
    const identity = `${role}:${userId}`;

    const token = await generateLiveKitToken({ roomName, identity, role });

    res.json({
      token,
      roomName,
      livekitUrl: process.env.LIVEKIT_URL,
    });
  } catch (err) {
    console.error("Token generation failed:", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

export default router;
