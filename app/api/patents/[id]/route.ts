import { type NextRequest, NextResponse } from "next/server"
import { patentsService } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patent = await patentsService.findById(params.id)
    if (!patent) {
      return NextResponse.json({ error: "Patent not found" }, { status: 404 })
    }
    return NextResponse.json(patent)
  } catch (error) {
    console.error("Error fetching patent:", error)
    return NextResponse.json({ error: "Failed to fetch patent" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const patent = await patentsService.update(params.id, data)
    if (!patent) {
      return NextResponse.json({ error: "Patent not found" }, { status: 404 })
    }
    return NextResponse.json(patent)
  } catch (error) {
    console.error("Error updating patent:", error)
    return NextResponse.json({ error: "Failed to update patent" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await patentsService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Patent not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting patent:", error)
    return NextResponse.json({ error: "Failed to delete patent" }, { status: 500 })
  }
}
