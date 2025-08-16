import { type NextRequest, NextResponse } from "next/server"
import { patentsService } from "@/lib/database"

export async function GET() {
  try {
    const patents = await patentsService.findAll()
    return NextResponse.json(patents)
  } catch (error) {
    console.error("Error fetching patents:", error)
    return NextResponse.json({ error: "Failed to fetch patents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const patent = await patentsService.create(data)
    return NextResponse.json(patent)
  } catch (error) {
    console.error("Error creating patent:", error)
    return NextResponse.json({ error: "Failed to create patent" }, { status: 500 })
  }
}
