import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const date = searchParams.get("date")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&exclude=minutely,alerts`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch forecast data")
    }

    const data = await response.json()

    let forecast = data.daily.map((item: any, index: number) => ({
      date: new Date((item.dt + data.timezone_offset) * 1000).toISOString().split("T")[0],
      temperature: Math.round(item.temp.day),
      tempMin: Math.round(item.temp.min),
      tempMax: Math.round(item.temp.max),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.humidity,
      windSpeed: item.wind_speed,
      precipitation: (item.rain?.["1h"] || 0) + (item.snow?.["1h"] || 0),
      uvIndex: item.uvi,
    }))

    if (date) {
      const targetDate = new Date(date).toISOString().split("T")[0]
      forecast = forecast.filter((item: any) => item.date === targetDate)
    }

    return NextResponse.json({ forecast })
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
  }
}
