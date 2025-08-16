import { type NextRequest, NextResponse } from "next/server"
import { experienceService } from "@/lib/database"

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
    const data = await request.json()
    const experience = await experienceService.create(data)
    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}
