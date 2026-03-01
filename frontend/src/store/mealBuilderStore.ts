import { create } from 'zustand';
import type { Ingredient, MealEntry } from '../types';

export interface MealBuilderState {
  advancedModeEnabled: boolean;
  mealEntries: MealEntry[];
}

export interface MealBuilderActions {
  toggleAdvancedMode: () => void;
  setAdvancedModeEnabled: (enabled: boolean) => void;
  addEntryToMeal: (ingredient: Ingredient, grams: number) => void;
  updateEntryQuantity: (entryId: string, grams: number) => void;
  removeEntry: (entryId: string) => void;
  clearMeal: () => void;
}

function createMealEntry(
  ingredient: Ingredient,
  grams: number
): MealEntry {
  const proteinGrams = (grams / 100) * ingredient.proteinPer100g;
  return {
    id: crypto.randomUUID(),
    ingredientId: ingredient.id,
    name: ingredient.name,
    grams,
    proteinPer100g: ingredient.proteinPer100g,
    proteinGrams,
  };
}

export const useMealBuilderStore = create<MealBuilderState & MealBuilderActions>((set) => ({
  advancedModeEnabled: false,
  mealEntries: [],

  toggleAdvancedMode: () =>
    set((state) => ({ advancedModeEnabled: !state.advancedModeEnabled })),

  setAdvancedModeEnabled: (enabled) =>
    set({ advancedModeEnabled: enabled }),

  addEntryToMeal: (ingredient, grams) =>
    set((state) => ({
      mealEntries: [...state.mealEntries, createMealEntry(ingredient, grams)],
    })),

  updateEntryQuantity: (entryId, grams) =>
    set((state) => {
      const entry = state.mealEntries.find((e) => e.id === entryId);
      if (!entry) return state;
      const proteinGrams = (grams / 100) * entry.proteinPer100g;
      return {
        mealEntries: state.mealEntries.map((e) =>
          e.id === entryId ? { ...e, grams, proteinGrams } : e
        ),
      };
    }),

  removeEntry: (entryId) =>
    set((state) => ({
      mealEntries: state.mealEntries.filter((e) => e.id !== entryId),
    })),

  clearMeal: () => set({ mealEntries: [] }),
}));

/** Derived: total protein in current meal (g). */
export function selectTotalMealProteinGrams(mealEntries: MealEntry[]): number {
  return mealEntries.reduce((sum, e) => sum + e.proteinGrams, 0);
}
