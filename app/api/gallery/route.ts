import { type NextRequest, NextResponse } from "next/server"
import { galleryService } from "@/lib/database"

export async function GET() {
  try {
    const gallery = await galleryService.findAll()
    return NextResponse.json(gallery)
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const galleryItem = await galleryService.create(data)
    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}
