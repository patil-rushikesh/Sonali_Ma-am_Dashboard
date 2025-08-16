import { type NextRequest, NextResponse } from "next/server"
import { galleryService } from "@/lib/database"
import { deleteFromCloudinary } from "@/lib/cloudinary"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const galleryItem = await galleryService.findById(params.id)
    if (!galleryItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }
    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Error fetching gallery item:", error)
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const galleryItem = await galleryService.update(params.id, data)
    if (!galleryItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }
    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const galleryItem = await galleryService.findById(params.id)
    if (!galleryItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    // Delete image from Cloudinary
    if (galleryItem.image?.publicId) {
      await deleteFromCloudinary(galleryItem.image.publicId)
    }

    const deleted = await galleryService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
