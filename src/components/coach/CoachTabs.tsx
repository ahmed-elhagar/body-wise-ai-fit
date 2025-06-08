
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, TrendingUp } from "lucide-react";
import { TraineesTab } from "./TraineesTab";
import { useI18n } from "@/hooks/useI18n";

interface CoachTabsProps {
  trainees: any[];
  selectedClient: string | null;
  setSelectedClient: (clientId: string | null) => void;
}

export const CoachTabs = ({ trainees, selectedClient, setSelectedClient }: CoachTabsProps) => {
  const { t } = useI18n();

  return (
    <Tabs defaultValue="clients" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 shadow-sm">
        <TabsTrigger 
          value="clients" 
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
        >
          {t('coach:clients')}
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          {t('coach:analytics')}
        </TabsTrigger>
        <TabsTrigger 
          value="messages" 
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          {t('coach:messages')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="clients" className="space-y-4">
        <TraineesTab 
          trainees={trainees}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
        />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('coach:performanceAnalytics')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('coach:analyticsComingSoon')}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="messages" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {t('coach:messageCenter')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('coach:messagesComingSoon')}</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
