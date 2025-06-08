
import React from "react";
import { Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProMemberBadgeProps {
  variant?: 'default' | 'large' | 'compact';
  className?: string;
  showIcon?: boolean;
}

const ProMemberBadge: React.FC<ProMemberBadgeProps> = ({
  variant = 'default',
  className,
  showIcon = true
}) => {
  const variants = {
    default: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1",
    large: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1.5",
    compact: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5"
  };

  const iconSizes = {
    default: "h-3 w-3",
    large: "h-4 w-4",
    compact: "h-2.5 w-2.5"
  };

  return (
    <Badge className={cn(variants[variant], className)}>
      {showIcon && <Crown className={cn(iconSizes[variant], "mr-1")} />}
      PRO
    </Badge>
  );
};

export default ProMemberBadge;
