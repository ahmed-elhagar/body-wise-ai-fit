
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, ArrowLeft, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoachTraineeChat } from "./CoachTraineeChat";

interface CoachMessagesTabProps {
  trainees: any[];
}

export const CoachMessagesTab = ({ trainees }: CoachMessagesTabProps) => {
  const { t } = useLanguage();
  const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter trainees based on search
  const filteredTrainees = trainees.filter(trainee =>
    `${trainee.trainee_profile?.first_name || ''} ${trainee.trainee_profile?.last_name || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    trainee.trainee_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedTrainee) {
    return (
      <CoachTraineeChat
        traineeId={selectedTrainee.trainee_id}
        traineeName={`${selectedTrainee.trainee_profile?.first_name || 'Unknown'} ${selectedTrainee.trainee_profile?.last_name || 'User'}`}
        onBack={() => setSelectedTrainee(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('Messages & Communications')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('Search trainees...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTrainees.length > 0 ? (
            <div className="space-y-3">
              {filteredTrainees.map((trainee) => (
                <div
                  key={trainee.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTrainee(trainee)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {(trainee.trainee_profile?.first_name?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {trainee.trainee_profile?.first_name || 'Unknown'} {trainee.trainee_profile?.last_name || 'User'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {trainee.trainee_profile?.email || 'No email available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Last message</div>
                      <div className="text-xs text-gray-400">2 hours ago</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {t('Open Chat')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? t('No trainees found') : t('No conversations yet')}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? t('Try adjusting your search terms')
                  : t('Start by adding trainees to begin conversations')
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
