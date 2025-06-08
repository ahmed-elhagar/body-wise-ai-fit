
interface LoadingStep {
  id: string;
  text: string;
  duration?: number;
}

export const getGenerationSteps = (t?: any): LoadingStep[] => [
  { id: 'analyzing', text: 'Analyzing your preferences...' },
  { id: 'calculating', text: 'Calculating nutritional requirements...' },
  { id: 'selecting', text: 'Selecting optimal meals...' },
  { id: 'generating', text: 'Generating your meal plan...' },
  { id: 'finalizing', text: 'Finalizing details...' }
];

export const getShuffleSteps = (t?: any): LoadingStep[] => [
  { id: 'shuffling', text: 'Shuffling meal combinations...' },
  { id: 'optimizing', text: 'Optimizing nutrition balance...' },
  { id: 'finalizing', text: 'Finalizing new combinations...' }
];
