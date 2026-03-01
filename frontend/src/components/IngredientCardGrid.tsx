import { useState, useMemo } from 'react';
import type { Ingredient } from '../types';
import { getIngredientEmoji, SERVING_GRAMS } from '../constants';

interface IngredientCardGridProps {
  ingredients: Ingredient[];
  dailyGoalGrams: number;
  mealBuilderEnabled: boolean;
  onAddToMeal: (ingredient: Ingredient, grams: number) => void;
}

function percentOfGoal(proteinGrams: number, dailyGoalGrams: number): number {
  if (dailyGoalGrams <= 0) return 0;
  return Math.min(100, (proteinGrams / dailyGoalGrams) * 100);
}

function categorizeIngredient(id: string): string {
  if (['paneer', 'cottage-cheese', 'siggis-skyr', 'fairlife-milk', 'fairlife-protein-shake'].includes(id)) {
    return 'Dairy Products';
  }
  if (['chickpeas', 'rajma', 'kala-chana', 'moong-dal', 'toor-dal', 'masoor-dal', 'black-beans'].includes(id)) {
    return 'Cooked Legumes & Pulses';
  }
  if (['firm-tofu', 'silken-tofu'].includes(id)) {
    return 'Soy Products';
  }
  return 'Other';
}

function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'Dairy Products':
      return '🥛';
    case 'Cooked Legumes & Pulses':
      return '🫘';
    case 'Soy Products':
      return '🌱';
    default:
      return '🥗';
  }
}

const CATEGORY_ORDER = ['Dairy Products', 'Cooked Legumes & Pulses', 'Soy Products', 'Other'];

export function IngredientCardGrid({
  ingredients,
  dailyGoalGrams,
  mealBuilderEnabled,
  onAddToMeal,
}: IngredientCardGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedIngredients = useMemo(() => {
    let filtered = ingredients;
    if (searchTerm.trim()) {
      filtered = ingredients.filter((ing) =>
        ing.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const groups: Record<string, Ingredient[]> = {};
    filtered.forEach((ingredient) => {
      const category = categorizeIngredient(ingredient.id);
      if (!groups[category]) groups[category] = [];
      groups[category].push(ingredient);
    });
    CATEGORY_ORDER.forEach((cat) => {
      if (groups[cat]) groups[cat].sort((a, b) => b.proteinPer100g - a.proteinPer100g);
    });
    return groups;
  }, [ingredients, searchTerm]);

  return (
    <div>
      <h2 className="section-head">What did you eat today?</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search ingredients"
        />
      </div>

      {CATEGORY_ORDER.map((category) => {
        const categoryIngredients = groupedIngredients[category];
        if (!categoryIngredients?.length) return null;

        return (
          <div key={category} className="ingredient-category v1-category">
            <h3 className="category-title v1-category-title">
              {getCategoryEmoji(category)} {category}
            </h3>
            <div className={`cards-grid ${mealBuilderEnabled ? 'meal-builder-on' : ''}`}>
              {categoryIngredients.map((ingredient, index) => {
                const proteinInServing =
                  (SERVING_GRAMS / 100) * ingredient.proteinPer100g;
                const percent = percentOfGoal(proteinInServing, dailyGoalGrams);
                const accentClass = index % 2 === 0 ? 'accent-olive' : 'accent-honey';

                return (
                  <div
                    key={ingredient.id}
                    className={`food-card ${accentClass}`}
                  >
                    <div className="food-card-emoji">
                      {getIngredientEmoji(ingredient.id)}
                    </div>
                    <div className="food-card-name">{ingredient.name}</div>
                    <div className="food-card-protein">
                      <strong>{ingredient.proteinPer100g.toFixed(1)}g</strong> per 100g
                    </div>
                    <div className="food-card-daily">
                      <div className="food-card-daily-label">
                        {percent.toFixed(0)}% of daily goal
                      </div>
                      <div className="food-card-daily-bar">
                        <div
                          className="food-card-daily-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="food-card-add"
                      onClick={() => onAddToMeal(ingredient, SERVING_GRAMS)}
                    >
                      Add to today&apos;s meal
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {Object.keys(groupedIngredients).length === 0 && (
        <div className="empty-state">
          <p>No ingredients found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}
