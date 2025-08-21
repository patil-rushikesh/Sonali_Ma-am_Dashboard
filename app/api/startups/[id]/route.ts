import { type NextRequest, NextResponse } from "next/server"
import { startupsService } from "@/lib/database"
import { deleteFromCloudinary } from "@/lib/cloudinary"

const AUTH_COOKIE = "dashboard_auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const startup = await startupsService.findById(params.id)
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }
    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error fetching startup:", error)
    return NextResponse.json({ error: "Failed to fetch startup" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json()
    const startup = await startupsService.update(params.id, data)
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }
    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error updating startup:", error)
    return NextResponse.json({ error: "Failed to update startup" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startup = await startupsService.findById(params.id)
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    // Delete image from Cloudinary
    if (startup.image?.publicId) {
      await deleteFromCloudinary(startup.image.publicId)
    }

    const deleted = await startupsService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete startup" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting startup:", error)
    return NextResponse.json({ error: "Failed to delete startup" }, { status: 500 })
  }
}
