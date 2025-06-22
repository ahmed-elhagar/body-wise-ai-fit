
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const FitnessChat = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Fitness Chat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Chat with our AI fitness assistant for personalized advice and support.
        </p>
      </CardContent>
    </Card>
  );
};

export default FitnessChat;
