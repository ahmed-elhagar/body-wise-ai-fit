
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
          {t("Trainees")}
        </TabsTrigger>
        <TabsTrigger 
          value="chats" 
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
        >
          {t("Active Chats")}
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
        >
          {t("Analytics")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="clients" className="mt-6">
        <TraineesTab 
          trainees={trainees} 
          onChatClick={setSelectedClient}
        />
      </TabsContent>

      <TabsContent value="chats" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t("Active Conversations")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("No active chats")}</h3>
              <p className="text-gray-600">{t("Recent conversations with your clients will appear here.")}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("Coaching Analytics")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("Analytics Coming Soon")}</h3>
              <p className="text-gray-600">{t("Detailed coaching analytics and client progress reports will be available here.")}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
