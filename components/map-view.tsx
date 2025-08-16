"use client"

import { useState } from "react"
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps"
import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { PlaceDetails } from "@/lib/api"

interface MapViewProps {
  location?: PlaceDetails | null
}

export function MapView({ location }: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <Card className="w-full h-96 lg:h-[500px] bg-card border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <MapPin className="h-12 w-12 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-card-foreground">API Key Required</h3>
              <p className="text-muted-foreground max-w-md">
                Please add your Google Maps API key to the environment variables.
              </p>
              <p className="text-sm text-muted-foreground">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Project Settings.</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const defaultCenter = { lat: 40.7128, lng: -74.006 } // New York City
  const mapCenter = location ? location.geometry.location : defaultCenter
  const mapZoom = location ? 12 : 10

  return (
    <Card className="w-full h-96 lg:h-[500px] bg-card border-border relative overflow-hidden">
      <APIProvider
        apiKey={apiKey}
        onLoad={() => console.log("[v0] Google Maps API loaded successfully")}
        onError={(error) => {
          console.error("[v0] Google Maps API error:", error)
          setMapError("Failed to load Google Maps API")
        }}
      >
        <Map
          defaultCenter={defaultCenter}
          center={mapCenter}
          defaultZoom={10}
          zoom={mapZoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          styles={[
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
            },
          ]}
        >
          {location && (
            <>
              <Marker
                position={location.geometry.location}
                onClick={() => setSelectedMarker(location.place_id || "unknown")} // Handle optional place_id safely
              />

              {selectedMarker === (location.place_id || "unknown") && ( // Handle optional place_id safely
                <InfoWindow position={location.geometry.location} onCloseClick={() => setSelectedMarker(null)}>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">{location.name}</h3>
                    <p className="text-xs text-gray-600">{location.formatted_address}</p>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </Map>
      </APIProvider>

      {/* Location info overlay */}
      {location && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-card-foreground px-3 py-2 rounded-lg shadow-md border">
          <div className="font-medium text-sm">{location.name}</div>
          <div className="text-xs text-muted-foreground">
            {location.geometry.location.lat.toFixed(4)}, {location.geometry.location.lng.toFixed(4)}
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <MapPin className="h-12 w-12 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-card-foreground">Map Error</h3>
              <p className="text-muted-foreground max-w-md">{mapError}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
