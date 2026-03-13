import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  const navigate = useNavigate();

  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <p>No recipes available</p>
      </div>
    );
  }

  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <div className="recipe-list-minimal">
      {recipes.map((recipe) => (
        <div 
          key={recipe.id} 
          className="recipe-item-minimal"
          onClick={() => handleRecipeClick(recipe)}
        >
          <div className="recipe-item-content">
            <div className="recipe-item-info">
              <h3 className="recipe-item-name">{recipe.name}</h3>
              <div className="recipe-item-meta">
                <span className="recipe-item-count">
                  {recipe.ingredients.length} ingredient{recipe.ingredients.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="recipe-item-protein">
              <div className="protein-amount">{recipe.totalProteinGrams.toFixed(1)}g</div>
              <div className="protein-label">protein</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
