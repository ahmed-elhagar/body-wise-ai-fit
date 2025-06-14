
import { Card } from "@/components/ui/card";
import { Bot, MessageCircle } from "lucide-react";

const AIChatInterface = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Chat Interface</h3>
          <p className="text-gray-500">Chat functionality coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
