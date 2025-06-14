
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

interface MobileOptimizedHeaderProps {
  title: string;
  onBack?: () => void;
  onAdd?: () => void;
}

const MobileOptimizedHeader = ({ title, onBack, onAdd }: MobileOptimizedHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      {onAdd && (
        <Button size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default MobileOptimizedHeader;
