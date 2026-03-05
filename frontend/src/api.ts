import type { Ingredient, Recipe, RecipeIngredientDetail } from './types';
import ingredientsData from './data/ingredients.json';
import recipesRaw from './data/recipes.json';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

/** Build recipes with details from raw recipes + ingredients (same logic as backend). */
function buildRecipesFromStatic(
  ingredients: Ingredient[],
  raw: Array<{ id: string; name: string; url?: string; ingredients: Array<{ ingredientId: string; grams: number }> }>
): Recipe[] {
  const byId = new Map(ingredients.map((i) => [i.id, i]));
  return raw.map((r) => {
    let totalProteinGrams = 0;
    const ingredientDetails: RecipeIngredientDetail[] = r.ingredients.map((ri) => {
      const ing = byId.get(ri.ingredientId);
      const proteinGrams = ing ? (ri.grams / 100) * ing.proteinPer100g : 0;
      totalProteinGrams += proteinGrams;
      return {
        ingredientId: ri.ingredientId,
        ingredientName: ing?.name ?? ri.ingredientId,
        grams: ri.grams,
        proteinGrams: Math.round(proteinGrams * 100) / 100,
      };
    });
    return {
      id: r.id,
      name: r.name,
      url: r.url || undefined,
      ingredients: ingredientDetails,
      totalProteinGrams: Math.round(totalProteinGrams * 100) / 100,
    };
  });
}

const staticIngredients = ingredientsData as Ingredient[];

export async function fetchIngredients(): Promise<Ingredient[]> {
  try {
    const response = await fetch(`${API_BASE}/ingredients`);
    if (response.ok) return response.json();
  } catch {
    // Fall through to static data
  }
  return staticIngredients;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE}/recipes`);
    if (response.ok) return response.json();
  } catch {
    // Fall through to static data
  }
  return buildRecipesFromStatic(staticIngredients, recipesRaw as Parameters<typeof buildRecipesFromStatic>[1]);
}
