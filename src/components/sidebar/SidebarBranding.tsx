
import { useI18n } from "@/hooks/useI18n";

const SidebarBranding = () => {
  const { isRTL } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">FF</span>
      </div>
      <span className="font-bold text-xl text-gray-900">FitFatta</span>
    </div>
  );
};

export default SidebarBranding;
