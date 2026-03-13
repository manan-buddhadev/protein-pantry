import { useState, useMemo } from 'react';
import type { Ingredient } from '../types';

interface IngredientCardGridProps {
  ingredients: Ingredient[];
  dailyGoalGrams: number;
}

function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'Dairy':
      return '🥛';
    case 'Cooked Legumes & Pulses':
      return '🫘';
    case 'Soy Products':
      return '🌱';
    case 'Others':
      return '🥗';
    default:
      return '🥗';
  }
}

const CATEGORY_ORDER = ['Dairy', 'Cooked Legumes & Pulses', 'Soy Products', 'Others'];

export function IngredientCardGrid({
  ingredients,
  dailyGoalGrams,
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
      const category = ingredient.category;
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
            <div className="cards-grid">
              {categoryIngredients.map((ingredient, index) => {
                const accentClass = index % 2 === 0 ? 'accent-olive' : 'accent-honey';

                return (
                  <div
                    key={ingredient.id}
                    className={`food-card ${accentClass}`}
                  >
                    <div className="food-card-emoji">
                      {getCategoryEmoji(category)}
                    </div>
                    <div className="food-card-name">{ingredient.name}</div>
                    <div className="food-card-protein">
                      {ingredient.unit && ingredient.proteinPerUnit !== undefined ? (
                        <>
                          <strong>{ingredient.proteinPerUnit.toFixed(1)}g</strong> per {ingredient.unit}
                        </>
                      ) : (
                        <>
                          <strong>{ingredient.proteinPer100g.toFixed(1)}g</strong> per 100g
                        </>
                      )}
                    </div>
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
