
import React, { useState } from 'react';
import { Calendar, Filter, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfDay, endOfDay, subDays, isSameDay, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFoodConsumption } from '../hooks/useFoodConsumption';
import { cn } from '@/lib/utils';

const FoodHistoryTab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [mealTypeFilter, setMealTypeFilter] = useState('all');
  
  const { 
    consumptionHistory, 
    isLoadingHistory, 
    deleteConsumption, 
    isDeletingConsumption 
  } = useFoodConsumption();

  // Filter consumption history based on selected date and view mode
  const filteredHistory = React.useMemo(() => {
    if (!consumptionHistory) return [];

    let filtered = [...consumptionHistory];

    // Filter by date range based on view mode
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case 'day':
        startDate = startOfDay(selectedDate);
        endDate = endOfDay(selectedDate);
        break;
      case 'week':
        startDate = startOfWeek(selectedDate);
        endDate = endOfWeek(selectedDate);
        break;
      case 'month':
        startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        break;
      default:
        startDate = startOfDay(selectedDate);
        endDate = endOfDay(selectedDate);
    }

    filtered = filtered.filter(item => {
      const itemDate = new Date(item.consumed_at);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Filter by meal type
    if (mealTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.meal_type === mealTypeFilter);
    }

    return filtered;
  }, [consumptionHistory, selectedDate, viewMode, mealTypeFilter]);

  // Group by date
  const groupedHistory = React.useMemo(() => {
    const groups: { [key: string]: typeof filteredHistory } = {};
    
    filteredHistory.forEach(item => {
      const date = format(new Date(item.consumed_at), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });

    // Sort dates descending
    const sortedDates = Object.keys(groups).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map(date => ({
      date,
      items: groups[date]
    }));
  }, [filteredHistory]);

  const getDayStats = (items: typeof filteredHistory) => {
    return items.reduce((stats, item) => ({
      calories: stats.calories + item.calories_consumed,
      protein: stats.protein + item.protein_consumed,
      carbs: stats.carbs + item.carbs_consumed,
      fat: stats.fat + item.fat_consumed,
      count: stats.count + 1
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setSelectedDate(prev => direction === 'next' ? addDays(prev, 1) : addDays(prev, -1));
    } else if (viewMode === 'week') {
      setSelectedDate(prev => direction === 'next' ? addDays(prev, 7) : addDays(prev, -7));
    } else {
      setSelectedDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        return newDate;
      });
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Navigation and Filters */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Food History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* View Mode Selector */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View:</span>
              <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Meal Type:</span>
              <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Meals</SelectItem>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {viewMode === 'day' && format(selectedDate, 'PPP')}
                    {viewMode === 'week' && `Week of ${format(startOfWeek(selectedDate), 'MMM d')}`}
                    {viewMode === 'month' && format(selectedDate, 'MMMM yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Results */}
      {groupedHistory.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No food history found</h3>
            <p className="text-gray-500">
              No meals logged for the selected {viewMode}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedHistory.map(({ date, items }) => {
            const dayStats = getDayStats(items);
            const isToday = isSameDay(new Date(date), new Date());
            
            return (
              <Card key={date} className="border border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {isToday ? 'Today' : format(new Date(date), 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {dayStats.count} {dayStats.count === 1 ? 'item' : 'items'} logged
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {Math.round(dayStats.calories)} cal
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        P: {Math.round(dayStats.protein)}g
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        C: {Math.round(dayStats.carbs)}g
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        F: {Math.round(dayStats.fat)}g
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {item.food_item?.name || 'Unknown Food'}
                            </h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.meal_type}
                            </Badge>
                            {item.food_item?.brand && (
                              <Badge variant="outline" className="text-xs">
                                {item.food_item.brand}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{item.quantity_g}g</span>
                            <span>•</span>
                            <span>{Math.round(item.calories_consumed)} cal</span>
                            <span>•</span>
                            <span>P: {Math.round(item.protein_consumed)}g</span>
                            <span>•</span>
                            <span>C: {Math.round(item.carbs_consumed)}g</span>
                            <span>•</span>
                            <span>F: {Math.round(item.fat_consumed)}g</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {format(new Date(item.consumed_at), 'h:mm a')}
                            </span>
                            {item.source === 'ai_analysis' && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                                AI Analyzed
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteConsumption(item.id)}
                          disabled={isDeletingConsumption}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FoodHistoryTab;
