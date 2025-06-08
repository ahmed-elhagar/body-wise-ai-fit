
import { useI18n } from "@/hooks/useI18n";

interface ExerciseErrorStateProps {
  onRetry: () => void;
}

export const ExerciseErrorState = ({ onRetry }: ExerciseErrorStateProps) => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {t('exercise:errorTitle') || 'Exercise Loading Error'}
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {t('exercise:errorMessage') || 'Unable to load your exercise program. Please try again or check your connection.'}
          </p>
          <div className="space-y-4">
            <button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('exercise:retry') || 'Try Again'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
