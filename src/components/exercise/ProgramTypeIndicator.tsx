
import { Badge } from "@/components/ui/badge";
import { Home, Building2 } from "lucide-react";

interface ProgramTypeIndicatorProps {
  type: "home" | "gym";
  className?: string;
}

export const ProgramTypeIndicator = ({ type, className = "" }: ProgramTypeIndicatorProps) => {
  return (
    <Badge 
      variant="outline" 
      className={`bg-white/80 ${className}`}
    >
      {type === "home" ? (
        <>
          <Home className="w-3 h-3 mr-1" />
          Home Workout
        </>
      ) : (
        <>
          <Building2 className="w-3 h-3 mr-1" />
          Gym Workout
        </>
      )}
    </Badge>
  );
};
