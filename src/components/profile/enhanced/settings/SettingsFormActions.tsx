
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface SettingsFormActionsProps {
  isUpdating: boolean;
  completionPercentage: number;
  onSave: () => void;
  onCancel?: () => void;
}

const SettingsFormActions = ({ 
  isUpdating, 
  completionPercentage, 
  onSave, 
  onCancel 
}: SettingsFormActionsProps) => {
  return (
    <Card className="p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {completionPercentage === 100 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-orange-500" />
            )}
            <span className="text-sm font-medium">Profile Completion</span>
          </div>
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
            {completionPercentage}%
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={onSave}
            disabled={isUpdating}
            className="min-w-[100px]"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SettingsFormActions;
