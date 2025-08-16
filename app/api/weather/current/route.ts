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
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()

    return NextResponse.json({
      weather: {
        temperature: Math.round(data.current.temperature_2m),
        description: getWeatherDescription(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        feelsLike: Math.round(data.current.apparent_temperature),
        precipitation: data.current.precipitation || 0,
        windDirection: data.current.wind_direction_10m,
      },
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  }
  return weatherCodes[code] || "Unknown"
}

function getWeatherIcon(code: number): string {
  // Map Open-Meteo codes to OpenWeather-style icon codes for consistency
  const iconMap: { [key: number]: string } = {
    0: "01d", // Clear sky
    1: "02d", // Mainly clear
    2: "03d", // Partly cloudy
    3: "04d", // Overcast
    45: "50d", // Fog
    48: "50d", // Depositing rime fog
    51: "09d", // Light drizzle
    53: "09d", // Moderate drizzle
    55: "09d", // Dense drizzle
    61: "10d", // Slight rain
    63: "10d", // Moderate rain
    65: "10d", // Heavy rain
    71: "13d", // Slight snow
    73: "13d", // Moderate snow
    75: "13d", // Heavy snow
    95: "11d", // Thunderstorm
    96: "11d", // Thunderstorm with hail
    99: "11d", // Thunderstorm with heavy hail
  }
  return iconMap[code] || "01d"
}
