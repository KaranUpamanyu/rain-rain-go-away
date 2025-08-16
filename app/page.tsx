"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { DatePicker } from "@/components/date-picker"
import { MapView } from "@/components/map-view"
import { Suggestions } from "@/components/suggestions"
import {
  getPlaceDetails,
  getCurrentWeather,
  getWeatherForecast,
  type PlacePrediction,
  type PlaceDetails,
  type WeatherData,
  type ForecastItem,
} from "@/lib/api"

export default function WeatherTripPlanner() {
  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleLocationSelect = async (prediction: PlacePrediction) => {
    setIsLoading(true)
    try {
      // Get place details for coordinates
      const placeDetails = await getPlaceDetails(prediction.place_id)
      if (placeDetails) {
        setSelectedLocation(placeDetails)

        // Fetch current weather
        const weather = await getCurrentWeather(placeDetails.geometry.location.lat, placeDetails.geometry.location.lng)
        setCurrentWeather(weather)

        // Fetch forecast for selected date
        const forecastData = await getWeatherForecast(
          placeDetails.geometry.location.lat,
          placeDetails.geometry.location.lng,
          selectedDate?.toISOString().split("T")[0],
        )
        setForecast(forecastData)
      }
    } catch (error) {
      console.error("Error fetching location data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = async (date: Date | undefined) => {
    setSelectedDate(date)

    if (selectedLocation && date) {
      setIsLoading(true)
      try {
        const forecastData = await getWeatherForecast(
          selectedLocation.geometry.location.lat,
          selectedLocation.geometry.location.lng,
          date.toISOString().split("T")[0],
        )
        setForecast(forecastData)
      } catch (error) {
        console.error("Error fetching forecast:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with search and date controls */}
      <div className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Removed RRGG branding and simplified layout */}
            <div className="flex-1 min-w-0">
              <SearchBar onLocationSelect={handleLocationSelect} />
            </div>
            <div className="w-full lg:w-auto">
              <DatePicker date={selectedDate} onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Map section - prominent central element */}
        <div className="w-full">
          <MapView location={selectedLocation} />
        </div>

        {/* Suggestions section */}
        <div className="w-full">
          <Suggestions location={selectedLocation} weather={currentWeather} forecast={forecast} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
