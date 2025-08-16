"use client"

import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { MapPin, AlertCircle } from "lucide-react"

export default function WeatherTripPlanner() {
  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationPermission(result.state)
        if (result.state === "granted") {
          getCurrentLocation()
        }
      })
    } else {
      setLocationPermission("prompt")
    }
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      return
    }

    setIsGettingLocation(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          const currentLocationDetails: PlaceDetails = {
            place_id: "current_location",
            name: "Current Location",
            formatted_address: "Your current location",
            geometry: {
              location: {
                lat: latitude,
                lng: longitude,
              },
            },
          }

          setSelectedLocation(currentLocationDetails)
          setLocationPermission("granted")

          const weather = await getCurrentWeather(latitude, longitude)
          setCurrentWeather(weather)

          const forecastData = await getWeatherForecast(latitude, longitude, selectedDate?.toISOString().split("T")[0])
          setForecast(forecastData)
        } catch (error) {
          console.error("Error fetching weather for current location:", error)
          setError("Failed to fetch weather data for your location.")
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        setIsGettingLocation(false)
        setLocationPermission("denied")

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied. Please enable location permissions and try again.")
            break
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.")
            break
          case error.TIMEOUT:
            setError("Location request timed out.")
            break
          default:
            setError("An unknown error occurred while retrieving location.")
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const handleLocationSelect = async (prediction: PlacePrediction) => {
    setIsLoading(true)
    setError(null)
    try {
      const placeDetails = await getPlaceDetails(prediction.place_id)
      if (placeDetails) {
        setSelectedLocation(placeDetails)

        const weather = await getCurrentWeather(placeDetails.geometry.location.lat, placeDetails.geometry.location.lng)
        setCurrentWeather(weather)

        const forecastData = await getWeatherForecast(
          placeDetails.geometry.location.lat,
          placeDetails.geometry.location.lng,
          selectedDate?.toISOString().split("T")[0],
        )
        setForecast(forecastData)
      }
    } catch (error) {
      console.error("Error fetching location data:", error)
      setError("Failed to fetch location data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = async (date: Date | undefined) => {
    setSelectedDate(date)

    if (selectedLocation && date) {
      setIsLoading(true)
      setError(null)
      try {
        const forecastData = await getWeatherForecast(
          selectedLocation.geometry.location.lat,
          selectedLocation.geometry.location.lng,
          date.toISOString().split("T")[0],
        )
        setForecast(forecastData)
      } catch (error) {
        console.error("Error fetching forecast:", error)
        setError("Failed to fetch weather forecast. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-6">
          {error && (
            <Alert className="mb-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 min-w-0">
              <SearchBar onLocationSelect={handleLocationSelect} />
            </div>
            <div className="flex items-center gap-2">
              {locationPermission !== "granted" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="whitespace-nowrap bg-transparent"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {isGettingLocation ? "Getting Location..." : "Use Current Location"}
                </Button>
              )}
              <div className="w-full lg:w-auto">
                <DatePicker date={selectedDate} onDateChange={handleDateChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="w-full">
          <MapView location={selectedLocation} />
        </div>

        <div className="w-full">
          <Suggestions
            location={selectedLocation}
            weather={currentWeather}
            forecast={forecast}
            isLoading={isLoading || isGettingLocation}
          />
        </div>
      </div>
    </div>
  )
}
