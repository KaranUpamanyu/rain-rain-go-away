"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getPlaceAutocomplete, type PlacePrediction } from "@/lib/api"

interface SearchBarProps {
  onLocationSelect?: (prediction: PlacePrediction) => void
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchValue.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      const results = await getPlaceAutocomplete(searchValue)
      setSuggestions(results)
      setShowSuggestions(true)
      setIsLoading(false)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchValue])

  const handleSuggestionClick = (prediction: PlacePrediction) => {
    setSearchValue(prediction.description)
    setShowSuggestions(false)
    onLocationSelect?.(prediction)
  }

  const handleSearch = () => {
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0])
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for a destination..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-4 h-12 text-base bg-input border-border focus:ring-2 focus:ring-ring"
        />
        <Button
          size="sm"
          onClick={handleSearch}
          disabled={isLoading || suggestions.length === 0}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
        >
          {isLoading ? "..." : "Search"}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10">
          {suggestions.map((prediction) => (
            <button
              key={prediction.place_id}
              className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2 first:rounded-t-md last:rounded-b-md"
              onClick={() => handleSuggestionClick(prediction)}
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                <div className="text-sm text-muted-foreground">{prediction.structured_formatting.secondary_text}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
