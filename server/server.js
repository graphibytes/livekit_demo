// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tokenRoutes from "./routes/token.js"; // note .js extension

dotenv.config();

const app = express();

// GLOBAL MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

// ROUTES
app.use("/api", tokenRoutes);

// HEALTH CHECK
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`LiveKit auth server running on port ${PORT}`),
);
