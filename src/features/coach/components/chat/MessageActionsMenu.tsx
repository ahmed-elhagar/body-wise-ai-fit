
import { Button } from "@/components/ui/button";
import { MoreVertical, Reply, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CoachChatMessage } from "../types/chatTypes";

interface MessageActionsMenuProps {
  message: CoachChatMessage;
  isOwnMessage: boolean;
  onReply: (message: CoachChatMessage) => void;
  onEdit: (message: CoachChatMessage) => void;
  onDelete: (messageId: string) => void;
}

const MessageActionsMenu = ({ 
  message, 
  isOwnMessage, 
  onReply, 
  onEdit, 
  onDelete 
}: MessageActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onReply(message)}>
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </DropdownMenuItem>
        {isOwnMessage && (
          <>
            <DropdownMenuItem onClick={() => onEdit(message)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(message.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageActionsMenu;
