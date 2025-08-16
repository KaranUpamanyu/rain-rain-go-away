import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get("place_id")

  if (!placeId) {
    return NextResponse.json({ error: "Place ID is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch place details")
    }

    const data = await response.json()

    return NextResponse.json({
      result: {
        name: data.result.name,
        formatted_address: data.result.formatted_address,
        geometry: data.result.geometry,
      },
    })
  } catch (error) {
    console.error("Place details API error:", error)
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 })
  }
}
