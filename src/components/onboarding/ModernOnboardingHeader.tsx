
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface ModernOnboardingHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
}

const ModernOnboardingHeader = ({ step, totalSteps, progress }: ModernOnboardingHeaderProps) => {
  const steps = [
    { number: 1, title: "Basic Info", description: "Tell us about yourself" },
    { number: 2, title: "Physical", description: "Your measurements" },
    { number: 3, title: "Goals", description: "What you want to achieve" },
    { number: 4, title: "Preferences", description: "Your food preferences" }
  ];

  return (
    <div className="mb-8">
      {/* App Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Welcome to FitFatta
        </h1>
        <p className="text-gray-600">Let's set up your personalized fitness journey</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </Progress>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-6">
        {steps.map((stepItem, index) => (
          <div key={stepItem.number} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Step Circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                ${step > stepItem.number 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                  : step === stepItem.number
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step > stepItem.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stepItem.number
                )}
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-2 transition-all duration-300
                  ${step > stepItem.number ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
            
            {/* Step Labels */}
            <div className="text-center mt-2">
              <div className={`
                text-xs font-medium transition-colors duration-300
                ${step === stepItem.number ? 'text-blue-600' : step > stepItem.number ? 'text-green-600' : 'text-gray-500'}
              `}>
                {stepItem.title}
              </div>
              <div className="text-xs text-gray-400 hidden sm:block">
                {stepItem.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernOnboardingHeader;
