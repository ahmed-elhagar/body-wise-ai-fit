
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  action: () => void;
  isRTL: boolean;
}

export const QuickActionItem = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  action, 
  isRTL 
}: QuickActionItemProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto p-4 flex flex-col items-center space-y-3 hover:bg-health-soft border-health-border transition-all duration-200 hover:border-health-primary group rounded-xl",
        isRTL ? "text-right" : "text-left"
      )}
      onClick={action}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200",
        color
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-center">
        <p className="font-medium text-sm text-health-text-primary">{title}</p>
        <p className="text-xs text-health-text-secondary hidden sm:block mt-1">{description}</p>
      </div>
    </Button>
  );
};
