
import { Sparkles } from "lucide-react";

const MotivationalContent = () => {
  return (
    <div className="text-center">
      <div className="mb-6">
        <Sparkles className="w-16 h-16 mx-auto text-purple-400 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Getting things ready...</h2>
      <p className="text-white/80 text-lg mb-2">
        Preparing your personalized experience
      </p>
      <p className="text-white/60 text-sm">
        This will just take a moment
      </p>
    </div>
  );
};

export default MotivationalContent;
