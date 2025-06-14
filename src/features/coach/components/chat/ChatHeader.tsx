
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { CoachChatMessage } from '@/features/coach/types';

// NOTE: This is a placeholder component.
interface ChatHeaderProps {
    coachName: string;
    isCoachOnline: boolean;
    coachLastSeen: string | null;
    isConnected: boolean;
    onBack: () => void;
}
export const ChatHeader = ({ coachName, onBack, isCoachOnline, coachLastSeen }: ChatHeaderProps) => (
  <div className="p-4 border-b flex items-center justify-between">
    <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
            <h2 className="font-bold text-lg">{coachName}</h2>
            <p className="text-xs text-gray-500">{isCoachOnline ? 'Online' : `Last seen: ${coachLastSeen || 'a while ago'}`}</p>
        </div>
    </div>
  </div>
);
export default ChatHeader;
