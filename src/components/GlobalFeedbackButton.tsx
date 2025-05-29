
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';

const GlobalFeedbackButton = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowFeedback(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-40"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Feedback
      </Button>
      
      <FeedbackForm 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </>
  );
};

export default GlobalFeedbackButton;
