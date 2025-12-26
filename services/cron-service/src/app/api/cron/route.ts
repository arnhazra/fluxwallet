import ky from "ky"

const API_URL = process.env.API_URL!

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
}

export async function GET(request: Request) {
  const res = await ky.post(`${API_URL}/apps/cashflow/execute`, {
    headers: NO_CACHE_HEADERS,
  })

  if (!res.ok) {
    return new Response("Cron execution failed", {
      status: 500,
      headers: NO_CACHE_HEADERS,
    })
  }

  return new Response("Cron executed successfully", {
    status: 200,
    headers: NO_CACHE_HEADERS,
  })
}
