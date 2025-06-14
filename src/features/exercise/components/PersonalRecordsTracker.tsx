
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PersonalRecordsTrackerProps {
  exercises: any[];
  onViewDetails: (recordId: string) => void;
}

export const PersonalRecordsTracker = ({ exercises, onViewDetails }: PersonalRecordsTrackerProps) => {
  const { t } = useLanguage();

  const mockRecords = [
    { id: '1', exercise: 'Bench Press', record: '80kg', date: '2024-01-15', improvement: '+5kg' },
    { id: '2', exercise: 'Squats', record: '100kg', date: '2024-01-10', improvement: '+10kg' },
    { id: '3', exercise: 'Deadlift', record: '120kg', date: '2024-01-05', improvement: '+15kg' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-semibold">{t('Personal Records')}</h3>
      </div>

      <div className="grid gap-4">
        {mockRecords.map((record) => (
          <Card key={record.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{record.exercise}</h4>
                <p className="text-2xl font-bold text-blue-600">{record.record}</p>
                <p className="text-sm text-gray-600">{record.date}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {record.improvement}
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(record.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
