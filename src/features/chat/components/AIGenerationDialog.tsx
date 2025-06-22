
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoadingIndicator, { LoadingStatus } from "@/components/ui/loading-indicator";
import { cn } from "@/lib/utils";

interface AIGenerationDialogProps {
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
  progress?: number;
  allowClose?: boolean;
}

const AIGenerationDialog: React.FC<AIGenerationDialogProps> = ({
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
        className="sm:max-w-lg bg-white border-gray-200 shadow-2xl"
        hideClose={!allowClose}
      >
        <div className="space-y-6 p-2">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
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
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
          {steps && steps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Processing Steps
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                      step.status === 'active' && "bg-blue-50 border border-blue-200",
                      step.status === 'completed' && "bg-green-50 border border-green-200",
                      step.status === 'error' && "bg-red-50 border border-red-200",
                      step.status === 'pending' && "bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                      step.status === 'pending' && "bg-gray-200 text-gray-500",
                      step.status === 'active' && "bg-blue-500 text-white",
                      step.status === 'completed' && "bg-green-500 text-white",
                      step.status === 'error' && "bg-red-500 text-white"
                    )}>
                      {step.status === 'completed' ? '✓' : 
                       step.status === 'error' ? '✗' : 
                       step.status === 'active' ? '...' : 
                       index + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-medium truncate",
                      step.status === 'active' && "text-blue-700",
                      step.status === 'completed' && "text-green-700",
                      step.status === 'error' && "text-red-700",
                      step.status === 'pending' && "text-gray-600"
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
            <p className="text-sm text-gray-500">
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

export default AIGenerationDialog;
