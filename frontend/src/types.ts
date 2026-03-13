export interface Ingredient {
  id: string;
  name: string;
  proteinPer100g: number;
  proteinPerUnit?: number;
  unit?: string;
  category: string;
}

export type ActivityLevel = 'light' | 'active' | 'muscleGain';

export interface MealItem {
  ingredientId: string;
  name: string;
  grams: number;
  proteinGrams: number;
}

/** A single line in the current meal (Advanced Mode). id is unique per line, not per ingredient. */
export interface MealEntry {
  id: string;
  ingredientId: string;
  name: string;
  grams: number;
  proteinPer100g: number;
  proteinGrams: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  grams: number;
}

export interface RecipeIngredientDetail {
  ingredientId: string;
  ingredientName: string;
  grams: number;
  proteinGrams: number;
}

export interface Recipe {
  id: string;
  name: string;
  url?: string;
  ingredients: RecipeIngredientDetail[];
  totalProteinGrams: number;
}
