import { type NextRequest, NextResponse } from "next/server"
import { copyrightsService } from "@/lib/database"

const AUTH_COOKIE = "dashboard_auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const copyright = await copyrightsService.findById(params.id)
    if (!copyright) {
      return NextResponse.json({ error: "Copyright not found" }, { status: 404 })
    }
    return NextResponse.json(copyright)
  } catch (error) {
    console.error("Error fetching copyright:", error)
    return NextResponse.json({ error: "Failed to fetch copyright" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json()
    const copyright = await copyrightsService.update(params.id, data)
    if (!copyright) {
      return NextResponse.json({ error: "Copyright not found" }, { status: 404 })
    }
    return NextResponse.json(copyright)
  } catch (error) {
    console.error("Error updating copyright:", error)
    return NextResponse.json({ error: "Failed to update copyright" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const deleted = await copyrightsService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Copyright not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting copyright:", error)
    return NextResponse.json({ error: "Failed to delete copyright" }, { status: 500 })
  }
}
