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

  const handleRecipeClick = (recipe: Recipe, e: React.MouseEvent) => {
    // Don't navigate if clicking on the external link
    if ((e.target as HTMLElement).closest('.recipe-item-link')) {
      return;
    }
    
    // If recipe has URL, open it in new tab
    if (recipe.url) {
      window.open(recipe.url, '_blank', 'noopener,noreferrer');
    } else {
      // Otherwise navigate to detail page
      navigate(`/recipes/${recipe.id}`);
    }
  };

  return (
    <div className="recipe-list-minimal">
      {recipes.map((recipe) => (
        <div 
          key={recipe.id} 
          className="recipe-item-minimal"
          onClick={(e) => handleRecipeClick(recipe, e)}
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

          <div className="recipe-item-link" title={recipe.url ? "View full recipe" : "View recipe details"}>
            {recipe.url ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
