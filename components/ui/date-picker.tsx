"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/components/ui/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  defaultMonth?: Date
  disabled?: (date: Date) => boolean
}

export function DatePicker({ 
  date, 
  setDate, 
  placeholder = "Pick a date", 
  className,
  defaultMonth,
  disabled
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-10 justify-start text-left font-normal border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors rounded-md",
            !date && "text-gray-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {date ? (
            <span className="font-medium text-gray-700">{format(date, "MMMM d, yyyy")}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 border border-gray-200 shadow-lg rounded-lg" 
        align="start"
      >
        <div className="bg-white rounded-lg">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            defaultMonth={defaultMonth}
            disabled={disabled}
          />
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {date ? (
                  <>Selected: <span className="font-medium text-gray-700">{format(date, "PP")}</span></>
                ) : (
                  "Select a date"
                )}
              </div>
              {date && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setDate(undefined)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 