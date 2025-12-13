export async function GET(request: Request) {
  const res = await fetch("https://api-fluxwallet.vercel.app/platform/email", {
    method: "GET", // or GET — depends on your email API
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    return new Response("Email API failed", { status: 500 })
  }

  return new Response("Cron executed successfully", { status: 200 })
}
