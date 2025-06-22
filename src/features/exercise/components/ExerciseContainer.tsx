
import React from 'react';
import { ExerciseContainer as MainExerciseContainer } from './containers/ExerciseContainer';

// Re-export the main container to maintain backward compatibility
export const ExerciseContainer: React.FC = () => {
  return <MainExerciseContainer />;
};

export default ExerciseContainer;
