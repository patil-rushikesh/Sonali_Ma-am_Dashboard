import { type NextRequest, NextResponse } from "next/server"
import { talksService } from "@/lib/database"
import { deleteFromCloudinary } from "@/lib/cloudinary"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const talk = await talksService.findById(params.id)
    if (!talk) {
      return NextResponse.json({ error: "Talk not found" }, { status: 404 })
    }
    return NextResponse.json(talk)
  } catch (error) {
    console.error("Error fetching talk:", error)
    return NextResponse.json({ error: "Failed to fetch talk" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const talk = await talksService.update(params.id, data)
    if (!talk) {
      return NextResponse.json({ error: "Talk not found" }, { status: 404 })
    }
    return NextResponse.json(talk)
  } catch (error) {
    console.error("Error updating talk:", error)
    return NextResponse.json({ error: "Failed to update talk" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const talk = await talksService.findById(params.id)
    if (!talk) {
      return NextResponse.json({ error: "Talk not found" }, { status: 404 })
    }

    // Delete image from Cloudinary
    if (talk.image?.publicId) {
      await deleteFromCloudinary(talk.image.publicId)
    }

    const deleted = await talksService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete talk" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting talk:", error)
    return NextResponse.json({ error: "Failed to delete talk" }, { status: 500 })
  }
}
