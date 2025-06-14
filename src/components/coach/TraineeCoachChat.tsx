
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

interface TraineeCoachChatProps {
  coachId: string;
  coachName: string;
  onBack: () => void;
}

const TraineeCoachChat = ({ coachId, coachName, onBack }: TraineeCoachChatProps) => {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold">{coachName}</h2>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <Card className="h-full p-6 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chat with {coachName}</h3>
            <p className="text-gray-500">Chat functionality coming soon!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TraineeCoachChat;
