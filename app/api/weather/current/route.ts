import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&exclude=minutely,alerts`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()

    return NextResponse.json({
      weather: {
        temperature: Math.round(data.current.temp),
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_speed,
        feelsLike: Math.round(data.current.feels_like),
        visibility: data.current.visibility / 1000, // Convert to km
        uvIndex: data.current.uvi,
        pressure: data.current.pressure,
      },
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
