
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface ConversationStartersProps {
  onStartConversation: (starter: string) => void;
}

const ConversationStarters = ({ onStartConversation }: ConversationStartersProps) => {
  const starters = [
    "What should I eat for breakfast?",
    "Create a workout plan for me",
    "Help me track my calories",
    "What are healthy snack options?"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Conversation Starters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {starters.map((starter, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onStartConversation(starter)}
              className="w-full justify-start"
            >
              {starter}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationStarters;
