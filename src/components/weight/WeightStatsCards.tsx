
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
}

interface WeightStatsCardsProps {
  weightEntries: WeightEntry[];
}

const WeightStatsCards = ({ weightEntries }: WeightStatsCardsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Weight Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Weight statistics coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default WeightStatsCards;
