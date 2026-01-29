

export async function getConsultationToken({ userId, role, consultationId }) {
  const res = await fetch("http://localhost:4000/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role, consultationId }),
  });

  if (!res.ok) throw new Error("Token request failed");

  return res.json();
}
