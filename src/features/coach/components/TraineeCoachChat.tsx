
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface TraineeCoachChatProps {
  traineeId?: string;
}

const TraineeCoachChat = ({ traineeId }: TraineeCoachChatProps) => {
  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Coach Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Chat functionality coming soon</p>
          {traineeId && <p className="text-sm">Trainee ID: {traineeId}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeCoachChat;
