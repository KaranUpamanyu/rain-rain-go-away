export interface PlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface PlaceDetails {
  place_id?: string // Added optional place_id to match Google Places API response
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export interface WeatherData {
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
  visibility: number
}

export interface ForecastItem {
  datetime: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  precipitation: number
}

// Places API functions
export async function getPlaceAutocomplete(input: string): Promise<PlacePrediction[]> {
  try {
    const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`)
    if (!response.ok) throw new Error("Failed to fetch autocomplete")
    const data = await response.json()
    return data.predictions || []
  } catch (error) {
    console.error("Autocomplete error:", error)
    return []
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    const response = await fetch(`/api/places/details?place_id=${placeId}`)
    if (!response.ok) throw new Error("Failed to fetch place details")
    const data = await response.json()
    return data.result
  } catch (error) {
    console.error("Place details error:", error)
    return null
  }
}

// Weather API functions
export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(`/api/weather/current?lat=${lat}&lon=${lon}`)
    if (!response.ok) throw new Error("Failed to fetch weather")
    const data = await response.json()
    return data.weather
  } catch (error) {
    console.error("Weather error:", error)
    return null
  }
}

export async function getWeatherForecast(lat: number, lon: number, date?: string): Promise<ForecastItem[]> {
  try {
    const url = `/api/weather/forecast?lat=${lat}&lon=${lon}${date ? `&date=${date}` : ""}`
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to fetch forecast")
    const data = await response.json()
    return data.forecast || []
  } catch (error) {
    console.error("Forecast error:", error)
    return []
  }
}

// Trip suggestions logic
export function generateTripSuggestions(
  weather: WeatherData,
  location: string,
): Array<{
  title: string
  description: string
  weatherScore: number
  activities: string[]
}> {
  const suggestions = []

  // Good weather suggestions
  if (weather.temperature > 20 && !weather.description.includes("rain")) {
    suggestions.push({
      title: "Perfect Day for Outdoor Adventures",
      description: `Great weather in ${location}! Ideal conditions for exploring outdoors.`,
      weatherScore: 95,
      activities: ["Hiking", "Sightseeing", "Photography", "Walking tours"],
    })
  }

  // Rainy weather suggestions
  if (weather.description.includes("rain")) {
    suggestions.push({
      title: "Indoor Cultural Experiences",
      description: `Rainy day in ${location}? Perfect time for museums and indoor attractions.`,
      weatherScore: 70,
      activities: ["Museums", "Art galleries", "Shopping", "Cafes"],
    })
  }

  // Cold weather suggestions
  if (weather.temperature < 10) {
    suggestions.push({
      title: "Cozy Winter Activities",
      description: `Bundle up in ${location}! Great weather for winter activities.`,
      weatherScore: 80,
      activities: ["Hot drinks", "Indoor markets", "Warm restaurants", "Spas"],
    })
  }

  // Hot weather suggestions
  if (weather.temperature > 30) {
    suggestions.push({
      title: "Beat the Heat",
      description: `Hot day in ${location}! Stay cool with these activities.`,
      weatherScore: 75,
      activities: ["Swimming", "Air-conditioned venues", "Early morning tours", "Shade activities"],
    })
  }

  return suggestions
}
