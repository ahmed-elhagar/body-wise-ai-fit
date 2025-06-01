
import { useState, useMemo } from 'react';
import type { ChatMessage } from './useCoachChat';

interface SearchStats {
  totalResults: number;
  totalMessages: number;
  hasResults: boolean;
  isFiltered: boolean;
}

export const useMessageSearch = (messages: ChatMessage[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    
    const query = searchQuery.toLowerCase().trim();
    return messages.filter(message => 
      message.message.toLowerCase().includes(query) ||
      message.sender_name?.toLowerCase().includes(query)
    );
  }, [messages, searchQuery]);

  const searchStats: SearchStats = useMemo(() => ({
    totalResults: filteredMessages.length,
    totalMessages: messages.length,
    hasResults: filteredMessages.length > 0,
    isFiltered: searchQuery.trim().length > 0
  }), [filteredMessages.length, messages.length, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearchActive,
    setIsSearchActive,
    filteredMessages,
    searchStats,
    clearSearch
  };
};
