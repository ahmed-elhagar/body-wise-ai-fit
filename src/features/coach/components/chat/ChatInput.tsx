
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

// NOTE: This is a placeholder component.
export const ChatInput = ({ message, onSend, onChange, onKeyPress, inputRef }: any) => (
  <div className="p-4 border-t flex items-center gap-2">
    <Input 
        ref={inputRef}
        value={message} 
        onChange={onChange} 
        onKeyPress={onKeyPress}
        placeholder="Type a message..." 
        className="flex-1"
    />
    <Button onClick={onSend}><Send className="h-4 w-4" /></Button>
  </div>
);
export default ChatInput;
