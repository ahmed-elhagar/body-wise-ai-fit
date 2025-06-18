
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import FeedbackForm from "./ui/FeedbackForm";

const GlobalFeedbackButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (feedback: string) => {
    console.log("Feedback submitted:", feedback);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <FeedbackForm 
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowForm(true)}
      className="fixed bottom-4 right-4 z-50 rounded-full"
      size="sm"
    >
      <MessageSquare className="w-4 h-4" />
    </Button>
  );
};

export default GlobalFeedbackButton;
