// services/livekit.ts

export interface TokenResponse {
  token: string;
  livekitUrl: string;
}

export async function fetchToken(
  userId: string,
  role: "doctor" | "patient",
  consultationId: string,
): Promise<TokenResponse> {
  const res = await fetch("http://localhost:7880/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role, consultationId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to connect to server. Status: ${res.status}`);
  }

  const data = await res.json();

  return {
    token: data.token,
    livekitUrl: data.livekitUrl || process.env.NEXT_PUBLIC_LIVEKIT_URL!,
  };
}
