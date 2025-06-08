
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle, BarChart3, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { TraineesTab } from "./TraineesTab";
import { CoachMessagesTab } from "./CoachMessagesTab";
import { CoachAnalyticsTab } from "./CoachAnalyticsTab";
import CoachTasksTab from "./CoachTasksTab";

interface CoachTabsProps {
  trainees: any[];
  setSelectedClient: (clientId: string) => void;
}

const CoachTabs = ({ trainees, setSelectedClient }: CoachTabsProps) => {
  const { t } = useI18n();

  return (
    <Tabs defaultValue="trainees" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="trainees" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {t('coach:trainees') || 'Trainees'}
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {t('coach:messages') || 'Messages'}
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {t('coach:analytics') || 'Analytics'}
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t('coach:tasks') || 'Tasks'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="trainees">
        <TraineesTab 
          trainees={trainees} 
          setSelectedClient={setSelectedClient}
        />
      </TabsContent>

      <TabsContent value="messages">
        <CoachMessagesTab trainees={trainees} />
      </TabsContent>

      <TabsContent value="analytics">
        <CoachAnalyticsTab trainees={trainees} />
      </TabsContent>

      <TabsContent value="tasks">
        <CoachTasksTab />
      </TabsContent>
    </Tabs>
  );
};

export default CoachTabs;
