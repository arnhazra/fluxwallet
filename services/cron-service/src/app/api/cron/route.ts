import ky from "ky"

const API_URL = process.env.API_URL!

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
}

export async function GET(request: Request) {
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  for (let i = 0; i < 2; i++) {
    await ky.post(`${API_URL}/apps/cashflow/execute`, {
      headers: NO_CACHE_HEADERS,
    })
    if (i < 4) {
      await delay(5000)
    }
  }

  return new Response("Cron executed successfully", {
    status: 200,
    headers: NO_CACHE_HEADERS,
  })
}
