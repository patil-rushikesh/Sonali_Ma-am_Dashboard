import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import {loginService} from "@/lib/database";
import { compareHash } from "@/lib/hashpass";
const SECRET = process.env.AUTH_SECRET || "supersecret"
const AUTH_COOKIE = "dashboard_auth"

export async function POST(request: Request) {
  const { userId, password } = await request.json()

  if (!userId || !password) {
    return NextResponse.json({ error: "User ID and password are required" }, { status: 400 })
  }

  const user = await loginService.findOne(userId)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (!(await compareHash(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  
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
