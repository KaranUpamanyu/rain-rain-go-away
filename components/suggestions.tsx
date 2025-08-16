"use client"

import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Suggestions() {
  const suggestions = [
    {
      time: "Morning (8-11 AM)",
      icon: Sun,
      weather: "Sunny, 68°F",
      rainChance: "5%",
      activities: ["Outdoor Photography", "Walking Tours", "Farmers Market"],
      recommendation: "Perfect time for outdoor activities with cool temperatures and clear skies.",
    },
    {
      time: "Afternoon (12-5 PM)",
      icon: Cloud,
      weather: "Partly Cloudy, 75°F",
      rainChance: "15%",
      activities: ["Museum Visits", "Shopping", "Café Hopping"],
      recommendation: "Great for indoor/outdoor mix. Comfortable temperature with some cloud cover.",
    },
    {
      time: "Evening (6-9 PM)",
      icon: CloudRain,
      weather: "Light Rain, 70°F",
      rainChance: "60%",
      activities: ["Indoor Dining", "Theater Shows", "Art Galleries"],
      recommendation: "Best to stay indoors. Perfect weather for cozy indoor experiences.",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Best Times to Visit</h2>
        <Badge variant="outline" className="bg-card text-card-foreground">
          Today • San Francisco, CA
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion, index) => {
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
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-muted-foreground">Light breeze</span>
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

      {/* Weather API integration placeholder */}
      <Card className="bg-muted/30 border-dashed border-2 border-border">
        <CardContent className="py-6 text-center">
          <Thermometer className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            OpenWeatherMap API integration will provide real-time weather data and personalized recommendations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
