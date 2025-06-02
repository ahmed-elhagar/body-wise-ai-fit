
import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
  duration?: number;
}

let toastCount = 0;

const toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

export const useToast = () => {
  const [, forceUpdate] = useState({});

  const toast = useCallback(({
    title,
    description,
    action,
    variant = 'default',
    duration = 5000,
    ...props
  }: Omit<Toast, 'id'>) => {
    const id = (++toastCount).toString();
    const newToast: Toast = {
      id,
      title,
      description,
      action,
      variant,
      duration,
      ...props,
    };

    toasts.push(newToast);
    listeners.forEach((listener) => listener([...toasts]));

    if (duration > 0) {
      setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id);
        if (index > -1) {
          toasts.splice(index, 1);
          listeners.forEach((listener) => listener([...toasts]));
        }
      }, duration);
    }

    return id;
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      const index = toasts.findIndex((t) => t.id === toastId);
      if (index > -1) {
        toasts.splice(index, 1);
        listeners.forEach((listener) => listener([...toasts]));
      }
    } else {
      toasts.splice(0, toasts.length);
      listeners.forEach((listener) => listener([]));
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts: [...toasts],
  };
};

export { toast } from 'sonner';
