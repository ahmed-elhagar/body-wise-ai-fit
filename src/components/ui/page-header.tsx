
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const PageHeader = ({ 
  title, 
  description, 
  icon, 
  children, 
  className 
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            {icon}
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 text-sm md:text-base">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
