import { type NextRequest, NextResponse } from "next/server";
import { learningResourcesService } from "@/lib/database";

const AUTH_COOKIE = "dashboard_auth";

// GET: fetch all learning resources
export async function GET() {
  try {
    const resources = await learningResourcesService.findAll();
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

// PUT: update a learning resource by ID
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    // expects data to have an 'id' field
    const updated = await learningResourcesService.update(data.id, data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

// POST: create a new learning resource
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const resource = await learningResourcesService.create(data);
    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}

// DELETE: remove a learning resource by ID
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await request.json();
    const deleted = await learningResourcesService.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
