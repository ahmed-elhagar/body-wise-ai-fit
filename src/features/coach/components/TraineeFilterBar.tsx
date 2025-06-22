
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TraineeFilterBarProps {
  trainees: any[];
  onFilteredTraineesChange: (filtered: any[]) => void;
  className?: string;
}

type FilterType = 'all' | 'active' | 'inactive' | 'at-risk' | 'completed';
type SortType = 'name' | 'activity' | 'progress' | 'joined';
type SortOrder = 'asc' | 'desc';

const TraineeFilterBar = ({ 
  trainees, 
  onFilteredTraineesChange, 
  className 
}: TraineeFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filters = [
    { 
      key: 'all' as FilterType, 
      label: 'All Trainees', 
      icon: Users,
      count: trainees.length 
    },
    { 
      key: 'active' as FilterType, 
      label: 'Active', 
      icon: Activity,
      count: trainees.filter(t => (t.trainee_profile?.ai_generations_remaining || 0) > 0).length 
    },
    { 
      key: 'completed' as FilterType, 
      label: 'Completed Profile', 
      icon: CheckCircle,
      count: trainees.filter(t => (t.trainee_profile?.profile_completion_score || 0) >= 80).length 
    },
    { 
      key: 'at-risk' as FilterType, 
      label: 'At Risk', 
      icon: AlertTriangle,
      count: trainees.filter(t => (t.trainee_profile?.profile_completion_score || 0) < 50).length 
    },
    { 
      key: 'inactive' as FilterType, 
      label: 'Inactive', 
      icon: Users,
      count: trainees.filter(t => (t.trainee_profile?.ai_generations_remaining || 0) === 0).length 
    }
  ];

  const applyFilters = () => {
    let filtered = [...trainees];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(trainee => {
        const profile = trainee.trainee_profile || {};
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase();
        const email = (profile.email || '').toLowerCase();
        const goal = (profile.fitness_goal || '').toLowerCase();
        
        return fullName.includes(searchQuery.toLowerCase()) ||
               email.includes(searchQuery.toLowerCase()) ||
               goal.includes(searchQuery.toLowerCase());
      });
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(trainee => {
        const profile = trainee.trainee_profile || {};
        const completionScore = profile.profile_completion_score || 0;
        const generationsRemaining = profile.ai_generations_remaining || 0;

        switch (activeFilter) {
          case 'active':
            return generationsRemaining > 0;
          case 'inactive':
            return generationsRemaining === 0;
          case 'completed':
            return completionScore >= 80;
          case 'at-risk':
            return completionScore < 50;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aProfile = a.trainee_profile || {};
      const bProfile = b.trainee_profile || {};
      
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = `${aProfile.first_name || ''} ${aProfile.last_name || ''}`.trim();
          bValue = `${bProfile.first_name || ''} ${bProfile.last_name || ''}`.trim();
          break;
        case 'progress':
          aValue = aProfile.profile_completion_score || 0;
          bValue = bProfile.profile_completion_score || 0;
          break;
        case 'activity':
          aValue = aProfile.ai_generations_remaining || 0;
          bValue = bProfile.ai_generations_remaining || 0;
          break;
        case 'joined':
          aValue = new Date(a.assigned_at || 0).getTime();
          bValue = new Date(b.assigned_at || 0).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    onFilteredTraineesChange(filtered);
  };

  // Apply filters whenever dependencies change
  useState(() => {
    applyFilters();
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setTimeout(applyFilters, 300); // Debounce search
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setTimeout(applyFilters, 0);
  };

  const handleSortChange = (sort: SortType) => {
    if (sortBy === sort) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sort);
      setSortOrder('asc');
    }
    setTimeout(applyFilters, 0);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search trainees by name, email, or goal..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSortChange(sortBy)}
            className="flex items-center gap-2"
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            Sort by {sortBy}
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange(filter.key)}
            className="flex items-center gap-2"
          >
            <filter.icon className="h-4 w-4" />
            {filter.label}
            <Badge 
              variant="secondary" 
              className={cn(
                "ml-1 text-xs",
                activeFilter === filter.key ? "bg-white/20 text-white" : "bg-gray-100"
              )}
            >
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || activeFilter !== 'all') && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchQuery && (
            <Badge variant="outline" className="text-xs">
              Search: "{searchQuery}"
            </Badge>
          )}
          {activeFilter !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Filter: {filters.find(f => f.key === activeFilter)?.label}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
              setTimeout(applyFilters, 0);
            }}
            className="text-xs h-6 px-2"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default TraineeFilterBar;
