
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, Clock, Utensils, Edit3, Trash2, MoreVertical } from "lucide-react";
import { format, parseISO } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FoodLog {
  id: string;
  consumed_at: string;
  meal_type: string;
  quantity_g: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  notes?: string;
  food_item?: {
    name: string;
    brand?: string;
  };
}

interface EnhancedFoodTimelineProps {
  foodLogs: FoodLog[];
  onRefetch: () => void;
}

const EnhancedFoodTimeline = ({ foodLogs, onRefetch }: EnhancedFoodTimelineProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mealFilter, setMealFilter] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Enhanced filtering and sorting
  const processedLogs = useMemo(() => {
    let filtered = foodLogs.filter(log => {
      const searchMatch = !searchTerm || 
        log.food_item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const mealMatch = mealFilter === "all" || log.meal_type === mealFilter;
      
      return searchMatch && mealMatch;
    });

    // Sort logs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "time":
          return new Date(b.consumed_at).getTime() - new Date(a.consumed_at).getTime();
        case "calories":
          return b.calories_consumed - a.calories_consumed;
        case "meal":
          return a.meal_type.localeCompare(b.meal_type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [foodLogs, searchTerm, mealFilter, sortBy]);

  // Group by meal type for better organization
  const groupedLogs = useMemo(() => {
    const groups: Record<string, FoodLog[]> = {};
    processedLogs.forEach(log => {
      if (!groups[log.meal_type]) {
        groups[log.meal_type] = [];
      }
      groups[log.meal_type].push(log);
    });
    return groups;
  }, [processedLogs]);

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🍽️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍴';
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'lunch': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'dinner': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'snack': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const totalCalories = processedLogs.reduce((sum, log) => sum + log.calories_consumed, 0);

  if (foodLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <Utensils className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No food logged today</h3>
        <p className="text-gray-500">Start tracking your nutrition by adding your first meal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile-friendly search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Mobile filter sheet */}
        <div className="sm:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(mealFilter !== "all" || sortBy !== "time") && (
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[300px]">
              <SheetHeader>
                <SheetTitle>Filter & Sort</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Meal Type</label>
                  <Select value={mealFilter} onValueChange={setMealFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meals</SelectItem>
                      <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                      <SelectItem value="lunch">🍽️ Lunch</SelectItem>
                      <SelectItem value="dinner">🌙 Dinner</SelectItem>
                      <SelectItem value="snack">🍎 Snacks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Time (Recent First)</SelectItem>
                      <SelectItem value="calories">Calories (High to Low)</SelectItem>
                      <SelectItem value="meal">Meal Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop filters */}
        <div className="hidden sm:flex gap-2">
          <Select value={mealFilter} onValueChange={setMealFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meals</SelectItem>
              <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
              <SelectItem value="lunch">🍽️ Lunch</SelectItem>
              <SelectItem value="dinner">🌙 Dinner</SelectItem>
              <SelectItem value="snack">🍎 Snacks</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="calories">Calories</SelectItem>
              <SelectItem value="meal">Meal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results summary */}
      {(searchTerm || mealFilter !== "all") && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>Showing {processedLogs.length} of {foodLogs.length} entries</span>
          {totalCalories > 0 && (
            <Badge variant="outline">
              {Math.round(totalCalories)} calories total
            </Badge>
          )}
          {(searchTerm || mealFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setMealFilter("all");
                setSortBy("time");
              }}
              className="h-6 px-2 text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Enhanced timeline */}
      <div className="space-y-4">
        {Object.entries(groupedLogs).map(([mealType, logs]) => (
          <div key={mealType} className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{getMealIcon(mealType)}</span>
              <h3 className="font-semibold text-gray-900 capitalize">{mealType}</h3>
              <Badge variant="outline" className="text-xs">
                {logs.length} item{logs.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {Math.round(logs.reduce((sum, log) => sum + log.calories_consumed, 0))} cal
              </Badge>
            </div>
            
            <div className="space-y-2">
              {logs.map((log) => (
                <Card key={log.id} className={`transition-all hover:shadow-md ${getMealColor(log.meal_type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 truncate">
                            {log.food_item?.name || 'Unknown Food'}
                          </h4>
                          {log.food_item?.brand && (
                            <Badge variant="outline" className="text-xs">
                              {log.food_item.brand}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(parseISO(log.consumed_at), 'h:mm a')}
                          </div>
                          <span>{log.quantity_g}g</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="bg-white/50 rounded px-2 py-1">
                            <span className="font-medium">{Math.round(log.calories_consumed)}</span>
                            <span className="text-gray-500 ml-1">cal</span>
                          </div>
                          <div className="bg-white/50 rounded px-2 py-1">
                            <span className="font-medium">{Math.round(log.protein_consumed)}</span>
                            <span className="text-gray-500 ml-1">p</span>
                          </div>
                          <div className="bg-white/50 rounded px-2 py-1">
                            <span className="font-medium">{Math.round(log.carbs_consumed)}</span>
                            <span className="text-gray-500 ml-1">c</span>
                          </div>
                          <div className="bg-white/50 rounded px-2 py-1">
                            <span className="font-medium">{Math.round(log.fat_consumed)}</span>
                            <span className="text-gray-500 ml-1">f</span>
                          </div>
                        </div>
                        
                        {log.notes && (
                          <p className="text-xs text-gray-600 mt-2 italic">"{log.notes}"</p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {processedLogs.length === 0 && (searchTerm || mealFilter !== "all") && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedFoodTimeline;
