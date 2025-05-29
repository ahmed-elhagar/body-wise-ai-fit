
import DaySelector from "@/components/DaySelector";

interface ExerciseDaySelectorProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: any;
}

export const ExerciseDaySelector = ({
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram
}: ExerciseDaySelectorProps) => {
  return (
    <DaySelector
      selectedDayNumber={selectedDayNumber}
      onDaySelect={setSelectedDayNumber}
    />
  );
};
