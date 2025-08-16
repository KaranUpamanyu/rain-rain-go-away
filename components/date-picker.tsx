"use client"

import { useState } from "react"
import { Calendar, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DatePicker() {
  const [selectedDate, setSelectedDate] = useState("")

  const formatDate = (date: string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="pl-10 pr-4 h-12 w-full sm:w-48 bg-input border-border focus:ring-2 focus:ring-ring"
        />
      </div>

      {selectedDate && (
        <Button variant="outline" className="h-12 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <CalendarDays className="h-4 w-4 mr-2" />
          {formatDate(selectedDate)}
        </Button>
      )}
    </div>
  )
}
