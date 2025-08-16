import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get("input")

  if (!input) {
    return NextResponse.json({ error: "Input parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch places")
    }

    const data = await response.json()

    return NextResponse.json({
      predictions: data.predictions.map((prediction: any) => ({
        place_id: prediction.place_id,
        description: prediction.description,
        structured_formatting: prediction.structured_formatting,
      })),
    })
  } catch (error) {
    console.error("Places API error:", error)
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 })
  }
}
