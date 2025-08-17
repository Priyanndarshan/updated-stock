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
      className={cn("p-3 select-none", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-2",
        caption: "flex justify-center pt-1 relative items-center px-10 mb-2",
        caption_label: "text-base font-semibold text-gray-800",
        nav: "flex items-center gap-1 absolute inset-0 justify-between",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white border border-gray-200 p-0 opacity-90 hover:opacity-100 hover:bg-gray-50 hover:text-blue-600 hover:border-gray-300 transition-colors rounded-full"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full mb-1",
        head_cell: "text-gray-500 w-9 font-medium text-xs text-center",
        row: "flex w-full mt-0.5",
        cell: "text-center p-0 relative w-9 h-9 focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal text-sm aria-selected:opacity-100 rounded-full hover:bg-gray-100 focus:bg-gray-100 mx-auto flex items-center justify-center"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white",
        day_today: "bg-gray-100 text-gray-900 font-medium",
        day_outside: "text-gray-400 opacity-50 hover:bg-transparent",
        day_disabled: "text-gray-300 opacity-50 hover:bg-transparent",
        day_range_middle:
          "aria-selected:bg-blue-50 aria-selected:text-blue-600",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          return orientation === 'left'
            ? <ChevronLeft className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 