import { useState, useMemo } from 'react';
import { Ingredient } from '../types';

interface IngredientTableProps {
  ingredients: Ingredient[];
  dailyGoal: number;
}

// Categorize ingredients by type
const categorizeIngredient = (id: string): string => {
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
};

// Get emoji for category
const getCategoryEmoji = (category: string): string => {
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
};

export function IngredientTable({ ingredients, dailyGoal: _dailyGoal }: IngredientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedIngredients = useMemo(() => {
    // Filter by search term
    let filtered = ingredients;
    if (searchTerm) {
      filtered = ingredients.filter((ing) =>
        ing.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Group by category
    const groups: Record<string, Ingredient[]> = {};
    filtered.forEach((ingredient) => {
      const category = categorizeIngredient(ingredient.id);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(ingredient);
    });

    // Sort ingredients within each category by protein (descending)
    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) => b.proteinPer100g - a.proteinPer100g);
    });

    return groups;
  }, [ingredients, searchTerm]);

  const categoryOrder = ['Dairy Products', 'Cooked Legumes & Pulses', 'Soy Products', 'Other'];

  return (
    <div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {categoryOrder.map((category) => {
        const categoryIngredients = groupedIngredients[category];
        if (!categoryIngredients || categoryIngredients.length === 0) return null;

        return (
          <div key={category} className="ingredient-category">
            <h3 className="category-title">{getCategoryEmoji(category)} {category}</h3>
            <div className="ingredient-cards-grid">
              {categoryIngredients.map((ingredient) => {
                return (
                  <div key={ingredient.id} className="ingredient-card">
                    <div className="ingredient-card-header">
                      <h4 className="ingredient-card-name">{ingredient.name}</h4>
                      <div className="ingredient-card-protein">
                        <span className="protein-value">{ingredient.proteinPer100g.toFixed(1)}</span>
                        <span className="protein-unit">g/100g</span>
                      </div>
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
          <p>No ingredients found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
