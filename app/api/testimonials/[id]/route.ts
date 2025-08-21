import { type NextRequest, NextResponse } from "next/server"
import { testimonialsService } from "@/lib/database"
import { deleteFromCloudinary } from "@/lib/cloudinary"

const AUTH_COOKIE = "dashboard_auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testimonial = await testimonialsService.findById(params.id)
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error("Error fetching testimonial:", error)
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json()
    const testimonial = await testimonialsService.update(params.id, data)
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const testimonial = await testimonialsService.findById(params.id)

    console.log(testimonial)

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    // Delete image from Cloudinary
    if (testimonial.image?.publicId) {
      await deleteFromCloudinary(testimonial.image.publicId)
    }

    const deleted = await testimonialsService.delete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
