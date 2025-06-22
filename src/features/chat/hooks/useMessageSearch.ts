
import { useState, useMemo } from 'react';

export interface SearchableMessage {
  id: string;
  message: string;
  sender_type: 'coach' | 'trainee';
  created_at: string;
  sender_name?: string;
}

export const useMessageSearch = (messages: SearchableMessage[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    sender: 'all' as 'all' | 'coach' | 'trainee',
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month'
  });

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim() && searchFilters.sender === 'all' && searchFilters.dateRange === 'all') {
      return messages;
    }

    return messages.filter(message => {
      // Text search
      const matchesQuery = !searchQuery.trim() || 
        message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (message.sender_name && message.sender_name.toLowerCase().includes(searchQuery.toLowerCase()));

      // Sender filter
      const matchesSender = searchFilters.sender === 'all' || 
        message.sender_type === searchFilters.sender;

      // Date filter
      let matchesDate = true;
      if (searchFilters.dateRange !== 'all') {
        const messageDate = new Date(message.created_at);
        const now = new Date();
        
        switch (searchFilters.dateRange) {
          case 'today':
            matchesDate = messageDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = messageDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = messageDate >= monthAgo;
            break;
        }
      }

      return matchesQuery && matchesSender && matchesDate;
    });
  }, [messages, searchQuery, searchFilters]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return {
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    filteredMessages,
    highlightText,
    hasActiveFilters: searchQuery.trim() !== '' || 
      searchFilters.sender !== 'all' || 
      searchFilters.dateRange !== 'all'
  };
};
