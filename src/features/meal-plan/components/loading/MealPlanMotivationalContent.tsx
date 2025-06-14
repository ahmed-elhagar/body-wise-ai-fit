
import { useState, useEffect } from "react";
import { ChefHat, Apple, Utensils, Carrot } from "lucide-react";

const motivationalContent = [
  {
    icon: ChefHat,
    text: "A healthy outside starts from the inside.",
  },
  {
    icon: Apple,
    text: "Planning your meals is planning your success.",
  },
  {
    icon: Utensils,
    text: "Good food is good mood.",
  },
  {
    icon: Carrot,
    text: "Eat for the body you want, not the body you have.",
  },
];

const MealPlanMotivationalContent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % motivationalContent.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const currentContent = motivationalContent[currentIndex];
  const IconComponent = currentContent.icon;

  return (
    <div className="text-center space-y-4 max-w-md mx-auto">
      <div 
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        
        <p className="text-white/90 text-lg font-medium leading-relaxed px-4">
          {currentContent.text}
        </p>
      </div>
      
      <div className="flex justify-center space-x-2 mt-6">
        {motivationalContent.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MealPlanMotivationalContent;
