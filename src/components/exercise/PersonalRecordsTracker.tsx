
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  TrendingUp, 
  Calendar,
  Dumbbell,
  Timer,
  Target,
  Plus,
  Star
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface PersonalRecord {
  id: string;
  exerciseName: string;
  recordType: 'weight' | 'reps' | 'time' | 'distance';
  value: number;
  unit: string;
  achievedDate: Date;
  previousRecord?: number;
  improvement?: number;
}

interface PersonalRecordsTrackerProps {
  records: PersonalRecord[];
  onAddRecord: () => void;
}

const PersonalRecordsTracker = ({ 
  records, 
  onAddRecord 
}: PersonalRecordsTrackerProps) => {
  const { t, isRTL } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: t('exercise:all') || 'All', icon: Star },
    { id: 'weight', name: t('exercise:weight') || 'Weight', icon: Dumbbell },
    { id: 'reps', name: t('exercise:reps') || 'Reps', icon: Target },
    { id: 'time', name: t('exercise:time') || 'Time', icon: Timer },
    { id: 'distance', name: t('exercise:distance') || 'Distance', icon: TrendingUp }
  ];

  const filteredRecords = selectedCategory === 'all' 
    ? records 
    : records.filter(record => record.recordType === selectedCategory);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'weight': return Dumbbell;
      case 'reps': return Target;
      case 'time': return Timer;
      case 'distance': return TrendingUp;
      default: return Trophy;
    }
  };

  const recentRecords = records
    .sort((a, b) => b.achievedDate.getTime() - a.achievedDate.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Trophy className="w-5 h-5 text-yellow-500" />
              {t('exercise:personalRecords') || 'Personal Records'}
            </CardTitle>
            <Button onClick={onAddRecord} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t('exercise:addRecord') || 'Add Record'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-8"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Records Highlight */}
      {recentRecords.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Star className="w-5 h-5 text-yellow-500" />
              {t('exercise:recentAchievements') || 'Recent Achievements'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentRecords.map((record) => {
                const Icon = getRecordIcon(record.recordType);
                return (
                  <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Icon className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-sm">{record.exerciseName}</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {record.value} {record.unit}
                    </div>
                    {record.improvement && (
                      <div className={`flex items-center gap-1 text-xs text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <TrendingUp className="w-3 h-3" />
                        +{record.improvement}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Records */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('exercise:allRecords') || 'All Records'} ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {t('exercise:noRecordsYet') || 'No personal records yet'}
              </p>
              <Button onClick={onAddRecord} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {t('exercise:addFirstRecord') || 'Add Your First Record'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const Icon = getRecordIcon(record.recordType);
                return (
                  <div key={record.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{record.exerciseName}</h4>
                          <div className={`flex items-center gap-2 text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="w-3 h-3" />
                            <span>{record.achievedDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                        <div className="text-lg font-bold">
                          {record.value} {record.unit}
                        </div>
                        {record.improvement && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{record.improvement}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalRecordsTracker;
