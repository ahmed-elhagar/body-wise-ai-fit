import React from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Copy, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

interface AIChatMessageProps {
  message: string;
  onCopy: () => void;
  onLike: () => void;
  onDislike: () => void;
}

const AIChatMessage = ({ message, onCopy, onLike, onDislike }: AIChatMessageProps) => {
  const { t } = useI18n();

  return (
    <Card className="w-full bg-gray-50 border-none shadow-none">
      <div className="flex items-start p-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback>
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 w-full">
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {message}
          </div>
          <div className="mt-2 flex items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={onCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onLike}>
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDislike}>
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIChatMessage;
