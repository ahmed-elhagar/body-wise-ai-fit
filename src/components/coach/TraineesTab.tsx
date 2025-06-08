
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface TraineesTabProps {
  trainees: any[];
  setSelectedClient?: (clientId: string | null) => void;
}

export const TraineesTab = ({ trainees, setSelectedClient }: TraineesTabProps) => {
  const { t } = useI18n();

  if (trainees.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('coach:noTrainees') || 'No trainees yet'}
          </h3>
          <p className="text-gray-600">
            {t('coach:addFirstTrainee') || 'Add your first trainee to get started'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainees.map((trainee: any, index: number) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {trainee.name || `Trainee ${index + 1}`}
                </h3>
                <p className="text-sm text-gray-600">{trainee.email || 'No email'}</p>
              </div>
              <Badge variant={trainee.active ? "default" : "secondary"}>
                {trainee.active ? t('common:active') || 'Active' : t('common:inactive') || 'Inactive'}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('common:goal') || 'Goal'}:</span>
                <span className="font-medium">{trainee.goal || t('common:notSet') || 'Not set'}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('coach:progress') || 'Progress'}:</span>
                <span className="font-medium">{trainee.progress || 0}%</span>
              </div>
              
              <div className="flex gap-2 pt-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedClient?.(trainee.id || `trainee-${index}`)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {t('coach:chat') || 'Chat'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {t('coach:progress') || 'Progress'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
