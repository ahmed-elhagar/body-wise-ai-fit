
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface HealthIssuesSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const HealthIssuesSelector = ({ value, onChange }: HealthIssuesSelectorProps) => {
  const healthIssues = [
    { id: 'no_issues', label: 'No issues', icon: '❌', color: 'red' },
    { id: 'sensitive_back', label: 'Sensitive back', icon: '🔴', color: 'blue' },
    { id: 'sensitive_knees', label: 'Sensitive knees', icon: '🔴', color: 'gray' },
    { id: 'sensitive_shoulders', label: 'Sensitive shoulders', icon: '🔴', color: 'gray' },
    { id: 'sensitive_elbows', label: 'Sensitive elbows', icon: '🔴', color: 'gray' }
  ];

  const handleToggle = (issueId: string) => {
    if (issueId === 'no_issues') {
      // If "No issues" is selected, clear all others
      onChange(value.includes('no_issues') ? [] : ['no_issues']);
    } else {
      // Remove "No issues" if selecting a specific issue
      const newValue = value.filter(id => id !== 'no_issues');
      const updatedValue = newValue.includes(issueId)
        ? newValue.filter(id => id !== issueId)
        : [...newValue, issueId];
      onChange(updatedValue);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xl font-bold text-gray-800">
          Do you have issues with one of the following areas?
        </Label>
        <p className="text-sm text-gray-600 mt-1">Choose all that apply</p>
      </div>
      <div className="space-y-3">
        {healthIssues.map((issue) => {
          const isSelected = value.includes(issue.id);
          const isNoIssues = issue.id === 'no_issues';
          return (
            <Card
              key={issue.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                isSelected
                  ? isNoIssues 
                    ? 'ring-2 ring-red-500 bg-red-50 border-red-200'
                    : 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => handleToggle(issue.id)}
              data-testid={`health-issue-${issue.id}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{issue.icon}</span>
                <span className="font-medium text-gray-800">{issue.label}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HealthIssuesSelector;
