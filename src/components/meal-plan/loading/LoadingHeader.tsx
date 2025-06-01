
import React from "react";
import { LucideIcon } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface LoadingHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const LoadingHeader = ({ icon: Icon, title, description }: LoadingHeaderProps) => {
  const { isRTL } = useI18n();

  return (
    <div className="mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Icon className="w-10 h-10 text-white animate-pulse" />
      </div>
      <h3 className={`text-2xl font-bold text-gray-800 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
};
