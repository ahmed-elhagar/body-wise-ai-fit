import { useQuery } from '@tanstack/react-query';

export const useUnreadMessages = () => {
  return useQuery({
    queryKey: ['unread-messages'],
    queryFn: () => Promise.resolve(0),
    staleTime: 30000,
  });
};

export const useUnreadMessagesByTrainee = () => {
  return useQuery({
    queryKey: ['unread-messages-by-trainee'],
    queryFn: () => Promise.resolve({}),
    staleTime: 30000,
  });
}; 