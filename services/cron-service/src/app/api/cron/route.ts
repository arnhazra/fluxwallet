import ky from "ky"

const API_URL = process.env.API_URL!
const INTERNAL_ADMIN_API_KEY = process.env.INTERNAL_ADMIN_API_KEY!

export async function GET(request: Request) {
  const res = await ky.get(`${API_URL}/apps/cashflow/execute`, {
    headers: { "x-api-key": INTERNAL_ADMIN_API_KEY },
  })

  if (!res.ok) {
    return new Response("Email API failed", { status: 500 })
  }

  return new Response("Cron executed successfully", { status: 200 })
}
