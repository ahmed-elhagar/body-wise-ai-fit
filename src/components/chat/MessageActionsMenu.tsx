
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Reply, Edit, Trash2, Copy } from "lucide-react";

interface MessageActionsMenuProps {
  message: any;
  isOwnMessage: boolean;
  onReply: (message: any) => void;
  onEdit: (message: any) => void;
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
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onReply(message)}>
          <Reply className="h-3 w-3 mr-2" />
          Reply
        </DropdownMenuItem>
        {isOwnMessage && (
          <>
            <DropdownMenuItem onClick={() => onEdit(message)}>
              <Edit className="h-3 w-3 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(message.id)}>
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageActionsMenu;
