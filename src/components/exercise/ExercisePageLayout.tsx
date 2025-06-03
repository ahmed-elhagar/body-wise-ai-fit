
import { ReactNode } from "react";

interface ExercisePageLayoutProps {
  children: ReactNode;
}

export const ExercisePageLayout = ({ children }: ExercisePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};
