import { type NextRequest, NextResponse } from "next/server"
import { talksService } from "@/lib/database"

export async function GET() {
  try {
    const talks = await talksService.findAll()
    return NextResponse.json(talks)
  } catch (error) {
    console.error("Error fetching talks:", error)
    return NextResponse.json({ error: "Failed to fetch talks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const talk = await talksService.create(data)
    return NextResponse.json(talk)
  } catch (error) {
    console.error("Error creating talk:", error)
    return NextResponse.json({ error: "Failed to create talk" }, { status: 500 })
  }
}
