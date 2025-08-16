import { SearchBar } from "@/components/search-bar";
import { DatePicker } from "@/components/date-picker";
import { MapView } from "@/components/map-view";
import { Suggestions } from "@/components/suggestions";

export default function WeatherTripPlanner() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with search and date controls */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <SearchBar />
            </div>
            <div className="w-full lg:w-auto">
              <DatePicker />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Map section - prominent central element */}
        <div className="w-full">
          <MapView />
        </div>

        {/* Suggestions section */}
        <div className="w-full">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}
