
import { useState } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, action, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, title, description, action, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
    
    return { id };
  };

  const dismiss = (toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  return {
    toast,
    dismiss,
    toasts
  };
};

export { toast } from 'sonner';
