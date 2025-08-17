"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "./utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-gray-700",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white border border-gray-200 p-0 opacity-70 hover:opacity-100 hover:bg-gray-50"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "grid grid-cols-7",
        head_cell: "text-gray-500 w-9 font-normal text-[0.8rem] py-1.5 text-center",
        row: "grid grid-cols-7 mt-2",
        cell: "text-center p-0 relative [&:has([aria-selected])]:bg-gray-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md mx-auto"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-teal-500 text-white hover:bg-teal-500 hover:text-white focus:bg-teal-500 focus:text-white rounded-md",
        day_today: "bg-gray-100 text-gray-900 rounded-md",
        day_outside: "day-outside text-gray-400 opacity-50",
        day_disabled: "text-gray-400 opacity-50",
        day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4 text-gray-600" />,
        IconRight: () => <ChevronRight className="h-4 w-4 text-gray-600" />,
        Caption: ({ displayMonth }) => (
          <div className="flex justify-center py-2 relative items-center">
            <span className="text-sm font-medium text-gray-700">
              {displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        )
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 