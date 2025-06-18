
import { useI18n } from "@/hooks/useI18n";
import { useAuth } from "@/features/auth";
import { DashboardStats } from "../types";

interface DashboardHeaderProps {
  stats?: DashboardStats;
}

export const DashboardHeader = ({ stats }: DashboardHeaderProps) => {
  const { t } = useI18n();
  const { user } = useAuth();

  const greeting = new Date().getHours() < 12 ? 'Good Morning' : 
                  new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  // Use both firstName and first_name for compatibility
  const displayName = user?.firstName || user?.first_name || 'User';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {displayName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {t('dashboard.welcome.subtitle')}
          </p>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {stats.caloriesConsumed}
              </div>
              <div className="text-sm text-blue-600">Calories Today</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {stats.streak}
              </div>
              <div className="text-sm text-green-600">Day Streak</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
