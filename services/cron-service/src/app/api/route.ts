const UI_URL = process.env.UI_URL!

export async function GET(request: Request) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: UI_URL,
    },
  })
}
