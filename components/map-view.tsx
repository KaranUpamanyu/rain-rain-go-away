"use client"

import { MapPin, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { PlaceDetails } from "@/lib/api"

interface MapViewProps {
  location?: PlaceDetails | null
}

export function MapView({ location }: MapViewProps) {
  return (
    <Card className="w-full h-96 lg:h-[500px] bg-card border-border relative overflow-hidden">
      {/* Placeholder for Google Maps integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <Zap className="h-3 w-3 text-secondary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-card-foreground">Interactive Map</h3>
            <p className="text-muted-foreground max-w-md">
              Google Maps integration will be added here. Users will be able to search, zoom, and select locations with
              weather overlays.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic location markers based on selected location */}
      {location ? (
        <>
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {location.name}
          </div>
          <div className="absolute bottom-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Lat: {location.geometry.location.lat.toFixed(4)}, Lng: {location.geometry.location.lng.toFixed(4)}
          </div>
        </>
      ) : (
        <>
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Select a location
          </div>
          <div className="absolute bottom-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Search above to get started
          </div>
        </>
      )}
    </Card>
  )
}
