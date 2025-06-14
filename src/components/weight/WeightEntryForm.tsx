
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";

interface WeightEntryFormProps {
  onSuccess: () => void;
}

const WeightEntryForm = ({ onSuccess }: WeightEntryFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Weight Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Weight entry form coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default WeightEntryForm;
