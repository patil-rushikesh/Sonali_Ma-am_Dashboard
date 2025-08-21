import { type NextRequest, NextResponse } from "next/server"
import { copyrightsService } from "@/lib/database"


const AUTH_COOKIE = "dashboard_auth"

export async function GET() {
  try {
    const copyrights = await copyrightsService.findAll()
    return NextResponse.json(copyrights)
  } catch (error) {
    console.error("Error fetching copyrights:", error)
    return NextResponse.json({ error: "Failed to fetch copyrights" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // const token = request.cookies.get(AUTH_COOKIE)?.value;
    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    const data = await request.json()
    const copyright = await copyrightsService.create(data)
    return NextResponse.json(copyright)
  } catch (error) {
    console.error("Error creating copyright:", error)
    return NextResponse.json({ error: "Failed to create copyright" }, { status: 500 })
  }
}
