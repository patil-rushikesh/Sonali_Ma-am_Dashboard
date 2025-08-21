import { type NextRequest, NextResponse } from "next/server"
import { researchGrantsService } from "@/lib/database"

const AUTH_COOKIE = "dashboard_auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const grant = await researchGrantsService.findById(params.id)
    if (!grant) {
      return NextResponse.json({ error: "Research grant not found" }, { status: 404 })
    }
    return NextResponse.json(grant)
  } catch (error) {
    console.error("Error fetching research grant:", error)
    return NextResponse.json({ error: "Failed to fetch research grant" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json()
    const grant = await researchGrantsService.update(params.id, data)
    if (!grant) {
      return NextResponse.json({ error: "Research grant not found" }, { status: 404 })
    }
    return NextResponse.json(grant)
  } catch (error) {
    console.error("Error updating research grant:", error)
    return NextResponse.json({ error: "Failed to update research grant" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await researchGrantsService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Research grant not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting research grant:", error)
    return NextResponse.json({ error: "Failed to delete research grant" }, { status: 500 })
  }
}
