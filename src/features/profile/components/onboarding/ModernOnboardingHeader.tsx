
import { Progress } from "@/components/ui/progress";

interface ModernOnboardingHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
}

const ModernOnboardingHeader = ({ step, totalSteps, progress }: ModernOnboardingHeaderProps) => {
  const stepTitles = [
    "Basic Information",
    "Body Composition", 
    "Goals & Health",
    "Summary"
  ];

  return (
    <div className="text-center space-y-4 md:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Complete Your Profile
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Step {step} of {totalSteps}: {stepTitles[step - 1]}
        </p>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="w-full h-2 md:h-3" />
        <p className="text-xs md:text-sm text-gray-500">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Step indicators for larger screens */}
      <div className="hidden md:flex justify-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 ${
              index < step - 1 ? 'text-green-600' : 
              index === step - 1 ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index < step - 1 ? 'bg-green-100 text-green-600' :
                index === step - 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium">{stepTitles[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernOnboardingHeader;
