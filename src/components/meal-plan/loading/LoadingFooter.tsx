
interface LoadingFooterProps {
  message: string;
}

export const LoadingFooter = ({ message }: LoadingFooterProps) => {
  return (
    <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
      <p className="text-xs text-green-700 font-medium">
        {message}
      </p>
    </div>
  );
};
