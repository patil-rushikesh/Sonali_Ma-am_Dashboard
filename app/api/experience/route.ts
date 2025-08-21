import { type NextRequest, NextResponse } from "next/server"
import { experienceService } from "@/lib/database"

const AUTH_COOKIE = "dashboard_auth";
export async function GET() {
  try {
    const experiences = await experienceService.findAll()
    return NextResponse.json(experiences)
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json()
    const experience = await experienceService.create(data)
    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}
