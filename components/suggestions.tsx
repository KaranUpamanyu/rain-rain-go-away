"use client"

import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { generateTripSuggestions, type PlaceDetails, type WeatherData, type ForecastItem } from "@/lib/api"

interface SuggestionsProps {
  location?: PlaceDetails | null
  weather?: WeatherData | null
  forecast?: ForecastItem[]
  isLoading?: boolean
}

export function Suggestions({ location, weather, forecast, isLoading }: SuggestionsProps) {
  const suggestions = weather && location ? generateTripSuggestions(weather, location.name) : []

  const timeBasedSuggestions =
    forecast?.slice(0, 3).map((item, index) => {
      const time = new Date(item.datetime)
      const timeLabel = index === 0 ? "Morning" : index === 1 ? "Afternoon" : "Evening"

      const getWeatherIcon = (description: string) => {
        if (description.includes("rain")) return CloudRain
        if (description.includes("cloud")) return Cloud
        return Sun
      }

      return {
        time: `${timeLabel} (${time.getHours()}:00)`,
        icon: getWeatherIcon(item.description),
        weather: `${item.description}, ${item.temperature}°C`,
        rainChance: `${Math.round(item.precipitation * 10)}%`,
        activities:
          item.temperature > 20 && !item.description.includes("rain")
            ? ["Outdoor Photography", "Walking Tours", "Sightseeing"]
            : ["Museums", "Indoor Dining", "Shopping"],
        recommendation:
          item.temperature > 20 && !item.description.includes("rain")
            ? "Perfect conditions for outdoor activities!"
            : "Great weather for indoor experiences and cozy activities.",
      }
    }) || []

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Loading Weather Data...</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border animate-pulse">
              <CardContent className="py-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!location || !weather) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Weather-Based Suggestions</h2>
        </div>

        <Card className="bg-muted/30 border-dashed border-2 border-border">
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Search for a destination</h3>
            <p className="text-muted-foreground">
              Enter a location above to get personalized weather-based travel recommendations.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current weather overview */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Weather-Based Suggestions</h2>
        <Badge variant="outline" className="bg-card text-card-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {location.name}
        </Badge>
      </div>

      {/* Current weather card */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Current Weather</h3>
              <p className="text-3xl font-bold text-primary">{weather.temperature}°C</p>
              <p className="text-muted-foreground capitalize">{weather.description}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Droplets className="h-4 w-4" />
                <span>Humidity: {weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wind className="h-4 w-4" />
                <span>Wind: {weather.windSpeed} m/s</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Thermometer className="h-4 w-4" />
                <span>Feels like: {weather.feelsLike}°C</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time-based suggestions */}
      {timeBasedSuggestions.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-foreground">Best Times to Visit Today</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {timeBasedSuggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon
              return (
                <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-card-foreground">{suggestion.time}</CardTitle>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">{suggestion.weather}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-muted-foreground">Rain: {suggestion.rainChance}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-card-foreground">Recommended Activities</h4>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.activities.map((activity, actIndex) => (
                          <Badge key={actIndex} variant="secondary" className="text-xs bg-secondary/50">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.recommendation}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* General trip suggestions */}
      {suggestions.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-foreground">Trip Recommendations</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-card-foreground">{suggestion.title}</CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {suggestion.weatherScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{suggestion.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-card-foreground">Suggested Activities</h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.activities.map((activity, actIndex) => (
                        <Badge key={actIndex} variant="secondary" className="text-xs bg-secondary/50">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
