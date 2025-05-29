
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface ExerciseEditFormProps {
  editData: {
    sets: number;
    reps: string;
    notes: string;
  };
  setEditData: (data: { sets: number; reps: string; notes: string }) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ExerciseEditForm = ({
  editData,
  setEditData,
  onSave,
  onCancel
}: ExerciseEditFormProps) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700">Sets</label>
          <Input
            type="number"
            value={editData.sets}
            onChange={(e) => setEditData({ ...editData, sets: parseInt(e.target.value) || 0 })}
            className="h-8"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Reps</label>
          <Input
            value={editData.reps}
            onChange={(e) => setEditData({ ...editData, reps: e.target.value })}
            placeholder="e.g., 12 or 8-12"
            className="h-8"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-700">Notes</label>
        <Textarea
          value={editData.notes}
          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
          placeholder="Add notes about your performance..."
          className="h-16 text-xs"
        />
      </div>
      <div className="flex space-x-1">
        <Button
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={onSave}
        >
          <Save className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
