
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Target,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';

interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  recordType: 'max_weight' | 'max_reps' | 'best_time' | 'total_volume';
  value: number;
  unit: string;
  achievedAt: Date;
  previousRecord?: number;
  improvement?: number;
}

interface PersonalRecordsTrackerProps {
  exercises: Exercise[];
  onViewDetails: (recordId: string) => void;
}

export const PersonalRecordsTracker = ({ exercises, onViewDetails }: PersonalRecordsTrackerProps) => {
  const { t } = useLanguage();
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<PersonalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from Supabase
    const mockRecords: PersonalRecord[] = [
      {
        id: '1',
        exerciseId: 'ex1',
        exerciseName: 'Push-ups',
        recordType: 'max_reps',
        value: 25,
        unit: 'reps',
        achievedAt: new Date('2024-01-15'),
        previousRecord: 20,
        improvement: 25
      },
      {
        id: '2',
        exerciseId: 'ex2',
        exerciseName: 'Squats',
        recordType: 'max_weight',
        value: 80,
        unit: 'kg',
        achievedAt: new Date('2024-01-10'),
        previousRecord: 75,
        improvement: 6.7
      },
      {
        id: '3',
        exerciseId: 'ex3',
        exerciseName: 'Plank',
        recordType: 'best_time',
        value: 120,
        unit: 'seconds',
        achievedAt: new Date('2024-01-12'),
        previousRecord: 90,
        improvement: 33.3
      }
    ];

    setPersonalRecords(mockRecords);
    setRecentAchievements(mockRecords.slice(0, 2));
    setIsLoading(false);
  }, [exercises]);

  const getRecordIcon = (recordType: string) => {
    switch (recordType) {
      case 'max_weight': return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'max_reps': return <Target className="w-4 h-4 text-blue-600" />;
      case 'best_time': return <Zap className="w-4 h-4 text-green-600" />;
      case 'total_volume': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default: return <Award className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatRecordValue = (record: PersonalRecord) => {
    if (record.recordType === 'best_time') {
      const minutes = Math.floor(record.value / 60);
      const seconds = record.value % 60;
      return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }
    return `${record.value} ${record.unit}`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('Recent Achievements')}</h3>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  {getRecordIcon(record.recordType)}
                  <div>
                    <div className="font-medium text-gray-900">{record.exerciseName}</div>
                    <div className="text-sm text-gray-600">
                      {t('New')} {t(record.recordType.replace('_', ' '))}: {formatRecordValue(record)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="bg-green-600">
                    +{record.improvement?.toFixed(1)}%
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {record.achievedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Personal Records */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('Personal Records')}</h3>
          </div>
          <Badge variant="outline">
            {personalRecords.length} {t('records')}
          </Badge>
        </div>

        <div className="space-y-3">
          {personalRecords.map((record) => (
            <div 
              key={record.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onViewDetails(record.id)}
            >
              <div className="flex items-center gap-3">
                {getRecordIcon(record.recordType)}
                <div>
                  <div className="font-medium text-gray-900">{record.exerciseName}</div>
                  <div className="text-sm text-gray-600">
                    {t(record.recordType.replace('_', ' '))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    {formatRecordValue(record)}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {record.achievedAt.toLocaleDateString()}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {personalRecords.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">{t('No Personal Records Yet')}</h4>
            <p className="text-gray-600 text-sm">
              {t('Complete exercises to start tracking your personal bests!')}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
