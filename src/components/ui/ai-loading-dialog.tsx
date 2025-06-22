
import React from "react";
import { Dialog, DialogContent } from "./dialog";
import LoadingIndicator, { LoadingStatus } from "./loading-indicator";
import { cn } from "@/lib/utils";

interface AILoadingDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  status: LoadingStatus;
  title?: string;
  message?: string;
  description?: string;
  steps?: Array<{
    id: string;
    label: string;
    status: 'pending' | 'active' | 'completed' | 'error';
  }>;
  progress?: number; // brand-neutral-6brand-neutral-600brand-neutral-600-1brand-neutral-600brand-neutral-600
  allowClose?: boolean;
}

const AILoadingDialog: React.FC<AILoadingDialogProps> = ({
  open,
  onOpenChange,
  status,
  title = "AI Processing",
  message,
  description,
  steps,
  progress,
  allowClose = false
}) => {
  return (
    <Dialog 
      open={open} 
      onOpenChange={allowClose ? onOpenChange : undefined}
    >
      <DialogContent 
        className="sm:max-w-lg bg-white border-brand-neutral-600 shadow-2xl"
        hideClose={!allowClose}
      >
        <div className="space-y-6 p-2">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-fitness-neutral-8brand-neutral-600brand-neutral-600 mb-2">
              {title}
            </h2>
          </div>

          {/* Main Loading Indicator */}
          <LoadingIndicator
            status={status}
            message={message}
            description={description}
            variant="default"
            size="lg"
            className="justify-center text-center"
          />

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-fitness-neutral-6brand-neutral-600brand-neutral-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-fitness-neutral-2brand-neutral-600brand-neutral-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-fitness-primary-5brand-neutral-600brand-neutral-600 to-fitness-accent-5brand-neutral-600brand-neutral-600 h-2 rounded-full transition-all duration-5brand-neutral-600brand-neutral-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
          {steps && steps.length > brand-neutral-600 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-fitness-neutral-7brand-neutral-600brand-neutral-600">
                Processing Steps
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-all duration-2brand-neutral-600brand-neutral-600",
                      step.status === 'active' && "bg-fitness-primary-5brand-neutral-600 border border-fitness-primary-2brand-neutral-600brand-neutral-600",
                      step.status === 'completed' && "bg-success-5brand-neutral-600 border border-success-2brand-neutral-600brand-neutral-600",
                      step.status === 'error' && "bg-error-5brand-neutral-600 border border-error-2brand-neutral-600brand-neutral-600",
                      step.status === 'pending' && "bg-fitness-neutral-5brand-neutral-600"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-brand-neutral-600",
                      step.status === 'pending' && "bg-fitness-neutral-2brand-neutral-600brand-neutral-600 text-fitness-neutral-5brand-neutral-600brand-neutral-600",
                      step.status === 'active' && "bg-fitness-primary-5brand-neutral-600brand-neutral-600 text-white",
                      step.status === 'completed' && "bg-success-5brand-neutral-600brand-neutral-600 text-white",
                      step.status === 'error' && "bg-error-5brand-neutral-600brand-neutral-600 text-white"
                    )}>
                      {step.status === 'completed' ? '✓' : 
                       step.status === 'error' ? '✗' : 
                       step.status === 'active' ? '...' : 
                       index + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-medium truncate",
                      step.status === 'active' && "text-fitness-primary-7brand-neutral-600brand-neutral-600",
                      step.status === 'completed' && "text-success-7brand-neutral-600brand-neutral-600",
                      step.status === 'error' && "text-error-7brand-neutral-600brand-neutral-600",
                      step.status === 'pending' && "text-fitness-neutral-6brand-neutral-600brand-neutral-600"
                    )}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer message */}
          <div className="text-center">
            <p className="text-sm text-fitness-neutral-5brand-neutral-600brand-neutral-600">
              {status === 'loading' && "Please wait while we process your request..."}
              {status === 'success' && "Operation completed successfully!"}
              {status === 'error' && "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AILoadingDialog;
