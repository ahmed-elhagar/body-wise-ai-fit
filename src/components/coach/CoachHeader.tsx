
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Star } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface CoachHeaderProps {
  totalClients: number;
}

export const CoachHeader = ({ totalClients }: CoachHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl" />
      
      <Card className="relative p-4 md:p-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
        <div className="absolute top-2 right-2 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {t("Coach")} {t("Dashboard")}
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                {t("Manage your clients and coaching sessions")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-3 py-1 text-xs md:text-sm font-semibold shadow-md">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {totalClients} {t("Active clients")}
            </Badge>
            <Badge variant="outline" className="bg-white/80 border-gray-200 text-gray-700 px-3 py-1 text-xs md:text-sm font-medium">
              <Star className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {t("Professional Coach")}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
