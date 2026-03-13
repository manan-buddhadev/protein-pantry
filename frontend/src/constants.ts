import type { ActivityLevel } from './types';

/** Protein per kg body weight by activity level (g/kg). */
export const PROTEIN_PER_KG: Record<ActivityLevel, number> = {
  light: 0.8,
  active: 1.2,
  muscleGain: 1.6,
};

export const SERVING_GRAMS = 100;

/** Emoji for each ingredient id. Fallback: 🥗 */
export const INGREDIENT_EMOJI: Record<string, string> = {
  paneer: '🧀',
  chickpeas: '🫘',
  rajma: '🫘',
  'kala-chana': '🫘',
  'moong-dal': '🌱',
  'toor-dal': '🌱',
  'masoor-dal': '🌱',
  'firm-tofu': '🌱',
  'silken-tofu': '🌱',
  'cottage-cheese': '🥛',
  'siggis-skyr': '🥛',
  'fairlife-milk': '🥛',
  'goodles-pasta': '🍝',
  'fairlife-protein-shake': '🥛',
  'black-beans': '🫘',
};

/** 'veg' | 'nonveg' by ingredient id. Default: 'veg'. */
export const INGREDIENT_DIET: Record<string, 'veg' | 'nonveg'> = {
  // All current ingredients are veg. Add eggs, chicken etc. here when present.
};

export function getIngredientEmoji(id: string): string {
  return INGREDIENT_EMOJI[id] ?? '🥗';
}

export function getIngredientDiet(id: string): 'veg' | 'nonveg' {
  return INGREDIENT_DIET[id] ?? 'veg';
}
