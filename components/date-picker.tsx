"use client"

import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const selectedDate = date ? date.toISOString().split("T")[0] : ""

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      onDateChange?.(new Date(dateString))
    } else {
      onDateChange?.(undefined)
    }
  }

  return (
    <div className="w-full lg:w-auto">
      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => handleDateChange(e.target.value)}
        className="h-12 w-full sm:w-48 bg-input border-border focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
