import { type NextRequest, NextResponse } from "next/server";
import { phdGuideService } from "@/lib/database";

// GET: fetch all entries
export async function GET() {
  try {
    const entries = await phdGuideService.findAll();
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching PhD guide entries:", error);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

// POST: create a new entry
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const entry = await phdGuideService.create(data);
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error creating PhD guide entry:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}

// DELETE: remove entry by ID
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const deleted = await phdGuideService.deleteById(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting PhD guide entry:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
