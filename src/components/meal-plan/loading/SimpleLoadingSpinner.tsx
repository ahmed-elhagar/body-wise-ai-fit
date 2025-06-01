
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SimpleLoadingSpinnerProps {
  message: string;
}

export const SimpleLoadingSpinner = ({ message }: SimpleLoadingSpinnerProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
        <div className="w-12 h-12 animate-spin border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </Card>
    </div>
  );
};
