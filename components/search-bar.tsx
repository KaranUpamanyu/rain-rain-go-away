"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("")
  const [suggestions] = useState(["New York, NY", "Los Angeles, CA", "Chicago, IL", "Miami, FL", "Seattle, WA"])

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for a destination..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-4 h-12 text-base bg-input border-border focus:ring-2 focus:ring-ring"
        />
        <Button
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
        >
          Search
        </Button>
      </div>

      {/* Autocomplete suggestions */}
      {searchValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10">
          {suggestions
            .filter((suggestion) => suggestion.toLowerCase().includes(searchValue.toLowerCase()))
            .map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2 first:rounded-t-md last:rounded-b-md"
                onClick={() => setSearchValue(suggestion)}
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
