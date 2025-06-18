
import { Card } from "@/components/ui/card";

const TypingIndicator = () => {
  return (
    <Card className="w-fit bg-gray-100 p-3">
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
      </div>
    </Card>
  );
};

export default TypingIndicator;
