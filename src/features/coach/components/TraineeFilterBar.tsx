
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TraineeFilterBarProps {
  trainees: any[];
  onFilteredTraineesChange: (filteredTrainees: any[]) => void;
}

const TraineeFilterBar = ({ trainees, onFilteredTraineesChange }: TraineeFilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [goalFilter, setGoalFilter] = useState<string>("all");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    let filtered = [...trainees];
    let filtersCount = 0;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(trainee => {
        const name = `${trainee.trainee_profile?.first_name || ''} ${trainee.trainee_profile?.last_name || ''}`.toLowerCase();
        const email = trainee.trainee_profile?.email?.toLowerCase() || '';
        return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
      });
      filtersCount++;
    }

    // Activity level filter
    if (activityFilter !== "all") {
      filtered = filtered.filter(trainee => 
        trainee.trainee_profile?.activity_level === activityFilter
      );
      filtersCount++;
    }

    // Goal filter
    if (goalFilter !== "all") {
      filtered = filtered.filter(trainee => 
        trainee.trainee_profile?.fitness_goal === goalFilter
      );
      filtersCount++;
    }

    setActiveFiltersCount(filtersCount);
    onFilteredTraineesChange(filtered);
  }, [searchTerm, activityFilter, goalFilter, trainees, onFilteredTraineesChange]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setActivityFilter("all");
    setGoalFilter("all");
  };

  // Get unique values for filter options
  const activityLevels = [...new Set(trainees.map(t => t.trainee_profile?.activity_level).filter(Boolean))];
  const fitnessGoals = [...new Set(trainees.map(t => t.trainee_profile?.fitness_goal).filter(Boolean))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search trainees by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Activity Level Filter */}
        <Select value={activityFilter} onValueChange={setActivityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Activity Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity Levels</SelectItem>
            {activityLevels.map(level => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Goal Filter */}
        <Select value={goalFilter} onValueChange={setGoalFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Fitness Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            {fitnessGoals.map(goal => (
              <SelectItem key={goal} value={goal}>{goal}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Active filters:</span>
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto p-1 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default TraineeFilterBar;
