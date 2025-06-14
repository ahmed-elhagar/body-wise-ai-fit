
interface EnhancedProfileHeaderProps {
  className?: string;
}

const EnhancedProfileHeader = ({ className }: EnhancedProfileHeaderProps) => {
  return (
    <div className={className}>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Profile Setup</h1>
      <p className="text-gray-600">Complete each section to get the most out of your fitness journey</p>
    </div>
  );
};

export default EnhancedProfileHeader;
