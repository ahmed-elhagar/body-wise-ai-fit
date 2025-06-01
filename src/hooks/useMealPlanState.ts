import { useState, useEffect } from 'react';
import { useI18n } from "@/hooks/useI18n";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useMealPlanData } from './useMealPlanData';

export const useMealPlanState = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { 
    currentWeekPlan, 
    dailyMeals, 
    isLoading, 
    error, 
    fetchMealPlan,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    addMealToDay,
    removeMealFromDay,
    exchangeMealInDay,
    isMealPlanLoading
  } = useMealPlanData();
  
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isAddSnackOpen, setIsAddSnackOpen] = useState(false);
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'initial' | 'regenerate' | 'ai'>('initial');

  useEffect(() => {
    if (user && profile) {
      fetchMealPlan();
    }
  }, [user, profile, fetchMealPlan]);

  const handleSelectDay = (dayNumber: number) => {
    setSelectedDay(dayNumber);
  };

  const handleShowShoppingList = () => {
    setIsShoppingListOpen(true);
  };

  const handleCloseShoppingList = () => {
    setIsShoppingListOpen(false);
  };

  const handleOpenAddSnack = () => {
    setIsAddSnackOpen(true);
  };

  const handleCloseAddSnack = () => {
    setIsAddSnackOpen(false);
  };

  const handleShowRecipe = (meal: any) => {
    setSelectedMeal(meal);
    setIsRecipeDialogOpen(true);
  };

  const handleCloseRecipe = () => {
    setSelectedMeal(null);
    setIsRecipeDialogOpen(false);
  };

  return {
    selectedDay,
    isShoppingListOpen,
    isAddSnackOpen,
    isRecipeDialogOpen,
    selectedMeal,
    isGenerating,
    generationType,
    currentWeekPlan,
    dailyMeals,
    isLoading,
    isMealPlanLoading,
    error,
    setSelectedDay,
    setIsShoppingListOpen,
    setIsAddSnackOpen,
    setIsRecipeDialogOpen,
    setSelectedMeal,
    setIsGenerating,
    setGenerationType,
    fetchMealPlan,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    addMealToDay,
    removeMealFromDay,
    exchangeMealInDay,
    handleSelectDay,
    handleShowShoppingList,
    handleCloseShoppingList,
    handleOpenAddSnack,
    handleCloseAddSnack,
    handleShowRecipe,
    handleCloseRecipe
  };
};
