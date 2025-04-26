import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// Data for weekday headers
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Function to generate calendar dates for a 7-day period
const generateWeekDates = (startDate: Date) => {
  const dates = [];
  const currentDate = new Date(startDate);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 7 days starting from the startDate
  for (let i = 0; i < 7; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // Check if this is today
    const isToday = currentDate.getTime() === today.getTime();
    
    dates.push({
      day,
      month,
      year,
      weekday: currentDate.getDay(),
      isCurrentDay: isToday,
      date: new Date(currentDate)
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Format the date to display the month and year
const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Format just the month and day
const formatMonthDay = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format the selected date in a more readable format
const formatSelectedDate = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

// Get the weekday name
const getWeekdayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

interface CalendarSectionProps {
  onDateSelect?: (date: Date) => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ onDateSelect }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [weekDates, setWeekDates] = useState<Array<{
    day: number;
    month: number;
    year: number;
    weekday: number;
    isCurrentDay: boolean;
    date: Date;
  }>>([]);

  // Generate week dates whenever the startDate changes
  useEffect(() => {
    const dates = generateWeekDates(startDate);
    setWeekDates(dates);
  }, [startDate]);

  // Navigate to the previous week
  const goToPreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  // Navigate to the next week
  const goToNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    
    return selectedDate.getDate() === date.getDate() && 
           selectedDate.getMonth() === date.getMonth() && 
           selectedDate.getFullYear() === date.getFullYear();
  };

  // Check if a date is highlighted (e.g., within the last 3 days)
  const isDateHighlighted = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const datesToHighlight = 3; // Highlight the last 3 days
    const lastHighlightDate = new Date(today);
    lastHighlightDate.setDate(today.getDate() - datesToHighlight);
    
    return date <= today && date > lastHighlightDate;
  };

  // Get the current week range for display
  const getWeekRangeText = () => {
    if (weekDates.length < 2) return "";
    
    const firstDate = weekDates[0].date;
    const lastDate = weekDates[weekDates.length - 1].date;
    
    // If the week spans two months
    if (firstDate.getMonth() !== lastDate.getMonth()) {
      return `${formatMonthDay(firstDate)} - ${formatMonthDay(lastDate)}`;
    }
    
    // If the week is within the same month
    return `${firstDate.getDate()} - ${formatMonthDay(lastDate)}`;
  };

  return (
    <div className="flex flex-col w-full gap-4">
      
      <Card className="flex flex-col w-full items-start pt-0 pb-3 px-0 bg-[#87a44e14] rounded-[28px] overflow-hidden border-none">
        <div className="flex items-center justify-between pl-4 pr-3 py-1 relative self-stretch w-full flex-[0_0_auto] bg-[#f6ffd9]">
          <div className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]">
            <Button
              variant="ghost"
              className="inline-flex gap-2 pl-2 pr-1 py-2.5 rounded-[100px] overflow-hidden items-center justify-center"
            >
              <span className="relative w-fit font-medium text-base text-center tracking-[0.10px] leading-5 whitespace-nowrap">
                {getWeekRangeText()}
              </span>
              <ChevronDownIcon className="w-[18px] h-[18px]" />
            </Button>
          </div>

          <div className="inline-flex items-start relative flex-[0_0_auto]">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 flex items-center justify-center rounded-full"
              onClick={goToPreviousWeek}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 flex items-center justify-center rounded-full"
              onClick={goToNextWeek}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <CardContent className="flex flex-col items-center gap-1 relative self-stretch w-full p-0">
          {/* Weekday names row */}
          <div className="flex h-12 items-center justify-center px-3 py-0 relative self-stretch w-full bg-[#f6ffd9] rounded-lg">
            {weekDates.map((dateInfo, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2.5 relative flex-1 self-stretch grow"
              >
                <div className="relative w-fit font-medium text-base text-center tracking-[0.50px] leading-6 whitespace-nowrap">
                  {getWeekdayName(dateInfo.date)}
                </div>
              </div>
            ))}
          </div>

          {/* Date numbers row */}
          <div className="flex items-start justify-center px-3 py-2 relative self-stretch w-full flex-[0_0_auto]">
            {weekDates.map((dateInfo, index) => {
              const isSelected = isDateSelected(dateInfo.date);
              const isHighlighted = isDateHighlighted(dateInfo.date);
              const isToday = dateInfo.isCurrentDay;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-center relative flex-1 self-stretch py-1"
                  onClick={() => handleDateClick(dateInfo.date)}
                >
                  {isToday && !isSelected && (
                    <div className="items-center justify-center flex w-10 h-10 gap-2.5 relative rounded-[100px] overflow-hidden cursor-pointer border-2 border-[#87a44e]">
                      <div className="flex w-10 h-10 gap-2.5 items-center justify-center relative">
                        <div className="font-medium text-base tracking-[0.50px] leading-6 relative w-fit text-center whitespace-nowrap">
                          {dateInfo.day}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isHighlighted && !isSelected && !isToday && (
                    <div className="items-center justify-center flex w-10 h-10 gap-2.5 relative rounded-[100px] overflow-hidden cursor-pointer">
                      <div className="flex w-10 h-10 gap-2.5 p-2.5 bg-[#c9e660] items-center justify-center relative">
                        <div className="font-normal text-base tracking-[0.50px] leading-6 relative w-fit text-center whitespace-nowrap">
                          {dateInfo.day}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="items-start bg-[#87a44e] flex w-10 h-10 gap-2.5 relative rounded-[100px] overflow-hidden cursor-pointer">
                      <div className="flex w-10 h-10 gap-2.5 items-center justify-center relative">
                        <div className="font-medium text-white text-sm tracking-[0.10px] leading-5 relative w-fit text-center whitespace-nowrap">
                          {dateInfo.day}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isHighlighted && !isSelected && !isToday && (
                    <div className="items-center justify-center flex w-10 h-10 gap-2.5 relative rounded-[100px] overflow-hidden cursor-pointer">
                      <div className="flex w-10 h-10 gap-2.5 items-center justify-center relative">
                        <div className="font-normal text-base tracking-[0.50px] leading-6 relative w-fit text-center whitespace-nowrap">
                          {dateInfo.day}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSection;