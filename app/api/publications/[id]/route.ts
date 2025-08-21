import { type NextRequest, NextResponse } from "next/server"
import { publicationsService } from "@/lib/database"

const AUTH_COOKIE = "dashboard_auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const publication = await publicationsService.findById(params.id)
    if (!publication) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 })
    }
    return NextResponse.json(publication)
  } catch (error) {
    console.error("Error fetching publication:", error)
    return NextResponse.json({ error: "Failed to fetch publication" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json()
    const publication = await publicationsService.update(params.id, data)
    if (!publication) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 })
    }
    return NextResponse.json(publication)
  } catch (error) {
    console.error("Error updating publication:", error)
    return NextResponse.json({ error: "Failed to update publication" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const deleted = await publicationsService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting publication:", error)
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 })
  }
}
