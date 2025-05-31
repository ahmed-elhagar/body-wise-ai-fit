
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  typingUsers: string[];
  getCoachName: () => string;
  className?: string;
}

const TypingIndicator = ({ typingUsers, getCoachName, className }: TypingIndicatorProps) => {
  if (typingUsers.length === 0) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 text-sm text-gray-500", className)}>
      <Avatar className="h-6 w-6">
        <AvatarFallback className="bg-green-100 text-green-700 text-xs">
          {getInitials(getCoachName())}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <span>{getCoachName()} is typing</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
