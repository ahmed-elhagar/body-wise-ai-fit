import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Target,
  Flame,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanState } from "@/hooks/useMealPlanState";
import { format, addDays } from "date-fns";
import MealPlanDayView from "./MealPlanDayView";
import MealPlanWeekView from "./MealPlanWeekView";
import ShoppingListDrawer from "../shopping-list/ShoppingListDrawer";
import MealPlanLoadingBackdrop from "./MealPlanLoadingBackdrop";
import MealRecipeDialog from "./MealRecipeDialog";
import MealExchangeDialog from "./MealExchangeDialog";
import SnackPickerDialog from "./SnackPickerDialog";
import MealPlanAIDialog from "./MealPlanAIDialog";
import { toast } from "sonner";
import type { DailyMeal } from "@/hooks/useMealPlanData";

import MealPlanPageRefactored from "./MealPlanPageRefactored";

const MealPlanPage = () => {
  // Use the new refactored component
  return <MealPlanPageRefactored />;
};

export default MealPlanPage;
