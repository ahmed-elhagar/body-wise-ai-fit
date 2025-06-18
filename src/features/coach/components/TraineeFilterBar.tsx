
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface TraineeFilterBarProps {
  trainees: any[];
  onFilteredTraineesChange: (filtered: any[]) => void;
}

export const TraineeFilterBar = ({ trainees, onFilteredTraineesChange }: TraineeFilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    let filtered = trainees;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(trainee => {
        const profile = trainee.trainee_profile || {};
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    // Apply active filter
    if (activeFilter === 'active') {
      filtered = filtered.filter(t => (t.trainee_profile?.profile_completion_score || 0) > 50);
    } else if (activeFilter === 'new') {
      filtered = filtered.filter(t => (t.trainee_profile?.profile_completion_score || 0) <= 50);
    }

    onFilteredTraineesChange(filtered);
  }, [searchTerm, activeFilter, trainees]);

  const activeCount = trainees.filter(t => (t.trainee_profile?.profile_completion_score || 0) > 50).length;
  const newCount = trainees.filter(t => (t.trainee_profile?.profile_completion_score || 0) <= 50).length;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search trainees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={activeFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter(null)}
        >
          All
          <Badge variant="secondary" className="ml-1">{trainees.length}</Badge>
        </Button>
        
        <Button
          variant={activeFilter === 'active' ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter('active')}
        >
          Active
          <Badge variant="secondary" className="ml-1">{activeCount}</Badge>
        </Button>
        
        <Button
          variant={activeFilter === 'new' ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter('new')}
        >
          New
          <Badge variant="secondary" className="ml-1">{newCount}</Badge>
        </Button>
      </div>
    </div>
  );
};
