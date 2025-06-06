
import BodyFatSlider from "./BodyFatSlider";

interface UnifiedBodyFatSelectorProps {
  value: number;
  onChange: (value: number) => void;
  gender: string;
}

const UnifiedBodyFatSelector = ({ value, onChange, gender }: UnifiedBodyFatSelectorProps) => {
  return (
    <div className="w-full">
      <BodyFatSlider
        value={value}
        onChange={onChange}
        gender={gender}
      />
    </div>
  );
};

export default UnifiedBodyFatSelector;
