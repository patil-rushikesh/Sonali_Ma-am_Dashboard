import { type NextRequest, NextResponse } from "next/server"
import { startupsService } from "@/lib/database"

export async function GET() {
  try {
    const startups = await startupsService.findAll()
    return NextResponse.json(startups)
  } catch (error) {
    console.error("Error fetching startups:", error)
    return NextResponse.json({ error: "Failed to fetch startups" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const startup = await startupsService.create(data)
    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error creating startup:", error)
    return NextResponse.json({ error: "Failed to create startup" }, { status: 500 })
  }
}
