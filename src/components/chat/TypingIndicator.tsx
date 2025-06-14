
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

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${getCoachName()} is typing`;
    }
    return `${typingUsers.length} people are typing`;
  };

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 animate-fade-in", className)}>
      <Avatar className="h-7 w-7 ring-2 ring-green-100">
        <AvatarFallback className="bg-green-100 text-green-700 text-xs font-medium">
          {getInitials(getCoachName())}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">{getTypingText()}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
