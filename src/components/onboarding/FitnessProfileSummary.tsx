
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface FitnessProfileSummaryProps {
  formData: any;
}

const FitnessProfileSummary = ({ formData }: FitnessProfileSummaryProps) => {
  // Calculate BMI
  const height = parseFloat(formData.height) / 100; // Convert cm to m
  const weight = parseFloat(formData.weight);
  const bmi = weight && height ? (weight / (height * height)).toFixed(1) : "0";

  // Determine BMI category
  const getBMICategory = (bmiValue: string) => {
    const numericBMI = parseFloat(bmiValue);
    if (numericBMI < 18.5) return { category: 'Underweight', color: 'blue' };
    if (numericBMI < 25) return { category: 'Normal', color: 'green' };
    if (numericBMI < 30) return { category: 'Overweight', color: 'yellow' };
    return { category: 'Obese', color: 'red' };
  };

  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xl font-bold text-gray-800">
          Your Fitness Profile
        </Label>
      </div>

      <Card className="p-6 bg-gray-900 text-white">
        <div className="space-y-6">
          {/* BMI Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Body Mass Index (BMI)</h3>
            <div className="relative">
              <div className="bg-gray-700 h-2 rounded-full mb-2">
                <div 
                  className={`h-full rounded-full bg-${bmiInfo.color}-500`}
                  style={{ width: `${Math.min((parseFloat(bmi) / 40) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <div className="text-center mt-2">
                <span className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                  You - {bmi}
                </span>
              </div>
            </div>
          </div>

          {/* Health Insights */}
          {parseFloat(bmi) > 25 && (
            <div className="bg-yellow-600 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-200">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-100">Risks of unhealthy BMI</h4>
                  <p className="text-sm text-yellow-200 mt-1">
                    High blood pressure, heart disease, stroke, type 2 diabetes, 
                    some cancers, chronic back & joint pain, increased mortality.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧑‍💻</span>
              <div>
                <span className="block text-gray-300">Lifestyle</span>
                <span className="font-semibold">
                  {formData.activity_level === 'sedentary' ? 'Sedentary' : 
                   formData.activity_level === 'lightly_active' ? 'Lightly Active' : 'Very Active'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <span className="block text-gray-300">Metabolism</span>
                <span className="font-semibold">
                  {parseFloat(bmi) < 25 ? 'Fast, burns calories easily' : 'Slow, easy to gain weight'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <span className="block text-gray-300">Previous Problems</span>
                <span className="font-semibold">
                  {formData.health_conditions?.length > 0 ? 
                    formData.health_conditions.join(', ') : 'None reported'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FitnessProfileSummary;
