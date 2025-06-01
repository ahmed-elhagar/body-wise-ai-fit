
import { Zap, Utensils, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface SnackFeaturesProps {
  remainingCalories: number;
}

const SnackFeatures = ({ remainingCalories }: SnackFeaturesProps) => {
  const { t, isRTL } = useI18n();

  const features = [
    {
      icon: Zap,
      title: t('addSnack.quickPrep'),
      description: t('addSnack.quickPrepDesc'),
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      iconColor: 'bg-green-500',
      textColor: 'text-green-800',
      descColor: 'text-green-600'
    },
    {
      icon: Utensils,
      title: t('addSnack.nutritious'),
      description: t('addSnack.nutritiousDesc'),
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconColor: 'bg-blue-500',
      textColor: 'text-blue-800',
      descColor: 'text-blue-600'
    },
    {
      icon: Target,
      title: t('addSnack.perfectCalories'),
      description: t('addSnack.perfectCaloriesDesc').replace('{calories}', remainingCalories.toString()),
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      iconColor: 'bg-purple-500',
      textColor: 'text-purple-800',
      descColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {features.map((feature, index) => (
        <div key={index} className={`flex items-center gap-4 p-4 ${feature.bgColor} rounded-xl border ${feature.borderColor} ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-10 h-10 ${feature.iconColor} rounded-full flex items-center justify-center shadow-md`}>
            <feature.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className={`font-medium ${feature.textColor}`}>{feature.title}</div>
            <div className={`text-sm ${feature.descColor}`}>{feature.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SnackFeatures;
