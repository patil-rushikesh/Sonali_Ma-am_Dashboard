import { type NextRequest, NextResponse } from "next/server";
import { learningResourcesService } from "@/lib/database";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resource = await learningResourcesService.findById(params.id);
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updated = await learningResourcesService.update(params.id, data);
    if (!updated) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await learningResourcesService.delete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
