
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Home, Building2, Target, Clock, Zap, Flame, Activity, Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExercisePreferences } from "@/hooks/useExerciseProgramPage";

interface AIExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: ExercisePreferences;
  setPreferences: (prefs: ExercisePreferences) => void;
  onGenerate: (preferences: ExercisePreferences) => void;
  isGenerating: boolean;
}

export const AIExerciseDialog = ({
  open,
  onOpenChange,
  preferences,
  setPreferences,
  onGenerate,
  isGenerating
}: AIExerciseDialogProps) => {
  const { t, isRTL } = useLanguage();

  const handleGenerate = () => {
    onGenerate(preferences);
    onOpenChange(false);
  };

  const fitnessGoals = [
    { value: "weight_loss", label: t('exercise.weightLoss') || "Weight Loss", icon: Flame },
    { value: "muscle_gain", label: t('exercise.muscleGain') || "Muscle Gain", icon: Activity },
    { value: "general_fitness", label: t('exercise.generalFitness') || "General Fitness", icon: Zap },
    { value: "strength", label: t('exercise.strength') || "Strength Building", icon: Target },
    { value: "endurance", label: t('exercise.endurance') || "Endurance", icon: Timer },
    { value: "flexibility", label: t('exercise.flexibility') || "Flexibility", icon: Activity }
  ];

  const fitnessLevels = [
    { value: "beginner", label: t('exercise.beginner') + " (0-6 " + t('exercise.months') + ")" },
    { value: "intermediate", label: t('exercise.intermediate') + " (6+ " + t('exercise.months') + ")" },
    { value: "advanced", label: t('exercise.advanced') + " (2+ " + t('exercise.years') + ")" }
  ];

  const timeOptions = [
    { value: "30", label: "30 " + t('exercise.minutes') },
    { value: "45", label: "45 " + t('exercise.minutes') },
    { value: "60", label: "60 " + t('exercise.minutes') },
    { value: "90", label: "90+ " + t('exercise.minutes') }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <DialogTitle className={`text-2xl font-bold text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
            {t('exercise.customizeProgram')}
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            {t('exercise.getPersonalizedPlan')}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Type Selection */}
          <Card className="p-6">
            <h3 className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Building2 className="w-5 h-5 text-fitness-primary" />
              {t('exercise.trainingEnvironment')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  preferences.workoutType === "home" 
                    ? "border-fitness-primary bg-fitness-primary/10 shadow-md" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPreferences({...preferences, workoutType: "home"})}
              >
                <div className={`flex items-center space-x-3 mb-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Home className="w-6 h-6 text-fitness-primary" />
                  <h4 className="font-semibold text-gray-800">{t('exercise.homeTraining')}</h4>
                </div>
                <p className={`text-sm text-gray-600 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('exercise.homeTrainingDesc')}
                </p>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <Badge variant="outline" className="text-xs">{t('exercise.bodyweight')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('exercise.minimalEquipment')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('exercise.flexibleSchedule')}</Badge>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  preferences.workoutType === "gym" 
                    ? "border-fitness-primary bg-fitness-primary/10 shadow-md" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPreferences({...preferences, workoutType: "gym"})}
              >
                <div className={`flex items-center space-x-3 mb-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Building2 className="w-6 h-6 text-fitness-primary" />
                  <h4 className="font-semibold text-gray-800">{t('exercise.gymTraining')}</h4>
                </div>
                <p className={`text-sm text-gray-600 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('exercise.gymTrainingDesc')}
                </p>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <Badge variant="outline" className="text-xs">{t('exercise.fullEquipment')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('exercise.progressiveOverload')}</Badge>
                  <Badge variant="outline" className="text-xs">{t('exercise.advancedTraining')}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Fitness Goals */}
          <Card className="p-6">
            <h3 className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-5 h-5 text-fitness-primary" />
              {t('exercise.fitnessGoal')}
            </h3>
            <RadioGroup 
              value={preferences.goalType} 
              onValueChange={(value) => setPreferences({...preferences, goalType: value})}
              className="grid md:grid-cols-3 gap-4"
            >
              {fitnessGoals.map((goal) => {
                const IconComponent = goal.icon;
                return (
                  <div key={goal.value} className={`flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <RadioGroupItem value={goal.value} id={goal.value} />
                    <Label htmlFor={goal.value} className={`cursor-pointer flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <IconComponent className="w-4 h-4 text-fitness-primary" />
                      {goal.label}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </Card>

          {/* Fitness Level & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Zap className="w-5 h-5 text-fitness-primary" />
                {t('exercise.fitnessLevel')}
              </h3>
              <RadioGroup 
                value={preferences.fitnessLevel} 
                onValueChange={(value) => setPreferences({...preferences, fitnessLevel: value})}
                className="space-y-3"
              >
                {fitnessLevels.map((level) => (
                  <div key={level.value} className={`flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <RadioGroupItem value={level.value} id={level.value} />
                    <Label htmlFor={level.value} className="cursor-pointer">{level.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h3 className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-5 h-5 text-fitness-primary" />
                {t('exercise.availableTime')}
              </h3>
              <RadioGroup 
                value={preferences.availableTime} 
                onValueChange={(value) => setPreferences({...preferences, availableTime: value})}
                className="space-y-3"
              >
                {timeOptions.map((time) => (
                  <div key={time.value} className={`flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <RadioGroupItem value={time.value} id={time.value} />
                    <Label htmlFor={time.value} className="cursor-pointer">{time.label} {t('exercise.perSession')}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          </div>

          {/* Program Features */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('exercise.programWillInclude')}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">45-{t('exercise.min')} {t('exercise.workouts')}</span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">4-5 {t('exercise.daysPerWeek')}</span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">{t('exercise.personalizedExercises')}</span>
              </div>
            </div>
            <div className={`flex flex-wrap gap-2 mt-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">{t('exercise.bodyweightExercises')}</Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">{t('exercise.noEquipmentNeeded')}</Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">{t('exercise.smallSpaceFriendly')}</Badge>
            </div>
          </Card>
        </div>

        <div className={`flex justify-end space-x-3 pt-6 border-t ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
                {t('exercise.generating')}...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                {t('exercise.generateProgram')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
