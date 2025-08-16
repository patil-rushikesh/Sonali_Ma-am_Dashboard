import { type NextRequest, NextResponse } from "next/server"
import { publicationsService } from "@/lib/database"

export async function GET() {
  try {
    const publications = await publicationsService.findAll()
    return NextResponse.json(publications)
  } catch (error) {
    console.error("Error fetching publications:", error)
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const publication = await publicationsService.create(data)
    return NextResponse.json(publication)
  } catch (error) {
    console.error("Error creating publication:", error)
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 })
  }
}
