import { NextResponse } from "next/server"

const AUTH_COOKIE = "dashboard_auth"

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
    },
  })
}
