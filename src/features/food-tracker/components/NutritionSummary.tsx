
import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { NutritionSummary as NutritionSummaryType } from '../types';

interface NutritionSummaryProps {
  summary: NutritionSummaryType;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const NutritionSummary = ({ summary, selectedDate, onDateChange }: NutritionSummaryProps) => {
  const macros = [
    {
      name: 'Calories',
      value: Math.round(summary.totalCalories),
      unit: 'cal',
      color: 'bg-blue-500',
    },
    {
      name: 'Protein',
      value: Math.round(summary.totalProtein),
      unit: 'g',
      color: 'bg-red-500',
    },
    {
      name: 'Carbs',
      value: Math.round(summary.totalCarbs),
      unit: 'g',
      color: 'bg-yellow-500',
    },
    {
      name: 'Fat',
      value: Math.round(summary.totalFat),
      unit: 'g',
      color: 'bg-green-500',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Nutrition Summary</h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {macros.map((macro) => (
          <div key={macro.name} className="text-center">
            <div className={cn("w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold", macro.color)}>
              {macro.value}
            </div>
            <p className="text-sm font-medium text-gray-700">{macro.name}</p>
            <p className="text-xs text-gray-500">{macro.unit}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NutritionSummary;
