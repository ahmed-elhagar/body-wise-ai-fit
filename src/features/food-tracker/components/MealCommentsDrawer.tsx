
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose 
} from "@/components/ui/sheet";
import { Send, Trash2, X, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealComments, MealComment } from "@/hooks/useMealComments";
import { useAuth } from "@/hooks/useAuth";
import { useCoach } from "@/hooks/useCoach";
import { format } from "date-fns";

interface MealCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mealLogId: string;
  traineeId: string;
  mealName: string;
}

const MealCommentsDrawer = ({ 
  isOpen, 
  onClose, 
  mealLogId, 
  traineeId, 
  mealName 
}: MealCommentsDrawerProps) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { trainees } = useCoach();
  const [newComment, setNewComment] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    comments, 
    addComment, 
    deleteComment, 
    isAddingComment, 
    isDeletingComment,
    subscribeToComments,
    refetch
  } = useMealComments(mealLogId);

  const isCoach = trainees && trainees.length > 0;
  const isTrainee = user?.id === traineeId;

  // Scroll to bottom when comments change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Set up real-time subscription
  useEffect(() => {
    if (!isOpen || !mealLogId) return;

    const unsubscribe = subscribeToComments(mealLogId, () => {
      refetch();
    });

    return unsubscribe;
  }, [isOpen, mealLogId, subscribeToComments, refetch]);

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    addComment({
      mealLogId,
      body: newComment.trim(),
      traineeId,
      coachId: isCoach ? user?.id : undefined,
    });

    setNewComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm(t('Are you sure you want to delete this comment?'))) {
      deleteComment(commentId);
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, HH:mm');
  };

  const renderComment = (comment: MealComment) => {
    const isCoachComment = comment.coach_id !== comment.trainee_id;
    const isMyComment = comment.coach_id === user?.id || comment.trainee_id === user?.id;
    const authorName = isCoachComment 
      ? `${comment.coach_profile?.first_name || ''} ${comment.coach_profile?.last_name || ''}`.trim()
      : `${comment.trainee_profile?.first_name || ''} ${comment.trainee_profile?.last_name || ''}`.trim();

    return (
      <div 
        key={comment.id} 
        className={`flex ${isMyComment ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[80%] ${isMyComment ? 'order-1' : 'order-2'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-600">
              {authorName || (isCoachComment ? t('Coach') : t('You'))}
            </span>
            {isCoachComment && (
              <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-0">
                {t('Coach')}
              </Badge>
            )}
            <span className="text-xs text-gray-400">
              {formatTime(comment.created_at)}
            </span>
          </div>
          
          <div 
            className={`rounded-lg px-3 py-2 ${
              isMyComment 
                ? isCoachComment 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
          </div>
          
          {isMyComment && (
            <div className="flex justify-end mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
                disabled={isDeletingComment}
                className="text-gray-400 hover:text-red-600 p-1 h-auto"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-[380px] flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              <SheetTitle className="text-lg font-semibold text-gray-900">
                {t('Meal Comments')}
              </SheetTitle>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <X className="w-4 h-4" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription className="text-sm text-gray-600 text-left">
            {mealName}
          </SheetDescription>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{t('No comments yet')}</p>
              <p className="text-gray-400 text-xs mt-1">
                {isCoach ? t('Start a conversation with your trainee') : t('Your coach can leave feedback here')}
              </p>
            </div>
          ) : (
            comments.map(renderComment)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {(isCoach || isTrainee) && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isCoach ? t('Leave feedback for your trainee...') : t('Reply to your coach...')}
                className="resize-none min-h-[80px] text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSendComment();
                  }
                }}
              />
              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim() || isAddingComment}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {t('Press Ctrl+Enter to send')}
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MealCommentsDrawer;
