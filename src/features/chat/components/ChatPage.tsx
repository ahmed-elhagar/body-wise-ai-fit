
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoachSystem } from "@/features/coach/hooks/useCoachSystem";
import { useOptimizedProfile } from "@/features/profile/hooks/useOptimizedProfile";
import TraineeCoachChat from "@/features/coach/components/TraineeCoachChat";
import EnhancedChatPage from "./EnhancedChatPage";

const ChatPage = () => {
  const { t } = useLanguage();
  const [activeChat, setActiveChat] = useState<'fitness' | string>('fitness');
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  
  const { 
    coaches, 
    totalUnreadMessages, 
    unreadMessagesByCoach,
    isLoadingCoachInfo 
  } = useCoachSystem();

  const { profile, isLoading: profileLoading } = useOptimizedProfile();

  useEffect(() => {
    console.log('ChatPage - User Profile:', profile);
    console.log('ChatPage - Coaches:', coaches);
    console.log('ChatPage - Unread messages:', totalUnreadMessages);
  }, [profile, coaches, totalUnreadMessages]);

  // Use the enhanced chat page
  return <EnhancedChatPage />;
};

export default ChatPage;
