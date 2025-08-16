import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

const USER_ID = process.env.DASHBOARD_USER_ID || "admin"
const PASSWORD = process.env.DASHBOARD_PASSWORD || "admin123"
const SECRET = process.env.AUTH_SECRET || "supersecret"
const AUTH_COOKIE = "dashboard_auth"

export async function POST(request: Request) {
  const { userId, password } = await request.json()

  if (userId === USER_ID && password === PASSWORD) {
    const token = sign({ userId }, SECRET, { expiresIn: "2h" })
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `${AUTH_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 2}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
      },
    })
    return response
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
