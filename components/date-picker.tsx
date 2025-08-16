"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function DatePicker() {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
      <div className="relative">
        <Input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="pl-10 pr-4 h-12 w-full sm:w-48 bg-input border-border focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
