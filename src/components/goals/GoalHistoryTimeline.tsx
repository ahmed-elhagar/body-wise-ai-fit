
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timeline, Target, TrendingUp } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useWeightTracking } from "@/hooks/useWeightTracking";

const GoalHistoryTimeline = () => {
  const { goals } = useGoals();
  const { weightEntries } = useWeightTracking();

  // Create timeline events from goals and weight entries
  const events = [];

  // Add goal creation events
  goals.forEach(goal => {
    events.push({
      id: `goal-${goal.id}`,
      date: new Date(goal.created_at),
      type: 'goal_created',
      title: `Goal Set: ${goal.title}`,
      description: goal.description || `Target: ${goal.target_value} ${goal.target_unit}`,
      icon: Target,
      color: 'blue'
    });
  });

  // Add weight milestones (every 1kg change)
  if (weightEntries.length > 1) {
    const startWeight = weightEntries[weightEntries.length - 1].weight;
    const currentWeight = weightEntries[0].weight;
    const totalChange = Math.abs(currentWeight - startWeight);
    
    if (totalChange >= 1) {
      const milestoneCount = Math.floor(totalChange);
      for (let i = 1; i <= milestoneCount; i++) {
        events.push({
          id: `milestone-${i}`,
          date: new Date(weightEntries[Math.floor((weightEntries.length - 1) * (i / milestoneCount))].recorded_at),
          type: 'weight_milestone',
          title: `${i}kg Progress Milestone`,
          description: `Continued progress toward your weight goal`,
          icon: TrendingUp,
          color: 'green'
        });
      }
    }
  }

  // Sort events by date (newest first)
  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  if (events.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timeline className="w-5 h-5 text-purple-600" />
            Goal History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Timeline className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Your goal milestones will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timeline className="w-5 h-5 text-purple-600" />
          Goal History & Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.slice(0, 10).map((event, index) => {
            const Icon = event.icon;
            const isLast = index === events.length - 1;
            
            return (
              <div key={event.id} className="flex items-start gap-4 relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                )}
                
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                  ${event.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                    event.color === 'green' ? 'bg-green-100 text-green-600' : 
                    'bg-purple-100 text-purple-600'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.date.toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                </div>
              </div>
            );
          })}
          
          {events.length > 10 && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing 10 most recent events ({events.length - 10} more)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalHistoryTimeline;
