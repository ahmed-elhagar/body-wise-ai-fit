
import { useState, useEffect } from "react";
import { Dumbbell, Heart, Zap, Target } from "lucide-react";

const motivationalContent = [
  {
    icon: Dumbbell,
    text: "Every workout brings you closer to your goals",
    type: "motivation"
  },
  {
    icon: Heart,
    text: "Your body can do it. It's your mind you have to convince",
    type: "motivation"
  },
  {
    icon: Zap,
    text: "Success isn't given. It's earned in the gym",
    type: "motivation"
  },
  {
    icon: Target,
    text: "The only bad workout is the one that didn't happen",
    type: "motivation"
  },
  {
    icon: Heart,
    text: "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't",
    type: "motivation"
  },
  {
    icon: Zap,
    text: "Your fitness journey starts with a single step",
    type: "motivation"
  },
  {
    icon: Dumbbell,
    text: "Consistency is the key to transformation",
    type: "motivation"
  },
  {
    icon: Target,
    text: "Champions train, losers complain",
    type: "motivation"
  }
];

const MotivationalContent = () => {
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
      
      {/* Progress dots */}
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

export default MotivationalContent;
