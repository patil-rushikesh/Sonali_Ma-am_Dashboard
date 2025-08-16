import { type NextRequest, NextResponse } from "next/server"
import { researchGrantsService } from "@/lib/database"

export async function GET() {
  try {
    const grants = await researchGrantsService.findAll()
    return NextResponse.json(grants)
  } catch (error) {
    console.error("Error fetching research grants:", error)
    return NextResponse.json({ error: "Failed to fetch research grants" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const grant = await researchGrantsService.create(data)
    return NextResponse.json(grant)
  } catch (error) {
    console.error("Error creating research grant:", error)
    return NextResponse.json({ error: "Failed to create research grant" }, { status: 500 })
  }
}
