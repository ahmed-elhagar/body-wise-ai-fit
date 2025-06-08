
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  User,
  Target,
  Calendar
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface TraineeProgress {
  id: string;
  name: string;
  progress: number;
  goal: string;
  lastActivity: string;
  trend: 'up' | 'down' | 'stable';
}

interface TraineeProgressOverviewProps {
  trainees: TraineeProgress[];
  onSelectTrainee: (traineeId: string) => void;
}

const TraineeProgressOverview = ({ trainees, onSelectTrainee }: TraineeProgressOverviewProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t('coach:traineeProgress') || 'Trainee Progress'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {trainees.map((trainee) => (
          <div 
            key={trainee.id}
            className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelectTrainee(trainee.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium truncate">{trainee.name}</h4>
                  <div className="flex items-center gap-1">
                    {trainee.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : trainee.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : null}
                    <span className="text-sm font-medium">{trainee.progress}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{trainee.goal}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{trainee.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Progress value={trainee.progress} className="h-2" />
          </div>
        ))}
        
        {trainees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('coach:noTrainees') || 'No trainees assigned yet'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TraineeProgressOverview;
