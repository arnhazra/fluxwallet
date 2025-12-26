import ky from "ky"

const API_URL = process.env.API_URL!

export async function GET(request: Request) {
  const res = await ky.get(`${API_URL}/apps/cashflow/execute`)

  if (!res.ok) {
    return new Response("Cron execution failed", {
      status: 500,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    })
  }

  return new Response("Cron executed successfully", {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    },
  })
}
