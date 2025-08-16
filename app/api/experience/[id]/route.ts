import { type NextRequest, NextResponse } from "next/server"
import { experienceService } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const experience = await experienceService.findById(params.id)
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }
    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const experience = await experienceService.update(params.id, data)
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }
    return NextResponse.json(experience)
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await experienceService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
