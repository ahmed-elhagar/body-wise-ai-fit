
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CoachChatWidget = () => {
  const [message, setMessage] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Coach Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48 bg-gray-50 rounded-lg p-4 overflow-y-auto">
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No messages yet</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Ask your coach..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button size="sm" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
