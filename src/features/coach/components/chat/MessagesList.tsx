import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, MoreVertical, Reply, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CoachChatMessage } from "../types/chatTypes";

interface MessagesListProps {
  messages: CoachChatMessage[];
  currentUserId?: string;
  coachName: string;
  typingUsers: string[];
  replyingTo?: CoachChatMessage | null;
  onReply: (message: CoachChatMessage) => void;
  onEdit: (message: CoachChatMessage) => void;
  onDelete: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList = ({ 
  messages, 
  currentUserId, 
  coachName,
  typingUsers,
  replyingTo,
  onReply,
  onEdit,
  onDelete,
  messagesEndRef
}: MessagesListProps) => {
  const { t } = useLanguage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 font-medium text-lg">
              {coachName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('No messages yet')}
          </h3>
          <p className="text-gray-600 max-w-sm">
            {t('Start the conversation by sending a message below')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {replyingTo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
            <div className="text-sm text-blue-600 font-medium mb-1">
              {t('Replying to')} {replyingTo.sender_type === 'coach' ? coachName : 'You'}
            </div>
            <div className="text-sm text-gray-700 truncate">
              {replyingTo.message}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`flex group ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md relative ${
                isOwn 
                  ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
                  : 'bg-white border border-gray-200 rounded-r-lg rounded-tl-lg shadow-sm'
              } px-4 py-3`}>
                
                {/* Message Actions */}
                {isOwn && (
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(message)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {t('Edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(message.id)}
                          className="text-red-600"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          {t('Delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {!isOwn && (
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onReply(message)}
                    >
                      <Reply className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <p className="text-sm leading-relaxed">{message.message}</p>
                
                <div className={`flex items-center gap-1 mt-2 text-xs ${
                  isOwn ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(message.created_at)}</span>
                  {message.updated_at && message.updated_at !== message.created_at && (
                    <span className="ml-1 opacity-75">(edited)</span>
                  )}
                  {isOwn && (
                    <CheckCircle2 className={`w-3 h-3 ml-1 ${
                      message.is_read ? 'text-green-300' : 'text-blue-200'
                    }`} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">
                  {coachName} {t('is typing...')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
