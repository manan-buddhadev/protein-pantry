import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipes } from '../api';
import { Recipe } from '../types';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const recipes = await fetchRecipes();
      const foundRecipe = recipes.find((r) => r.id === id);
      
      if (!foundRecipe) {
        setError('Recipe not found');
      } else {
        setRecipe(foundRecipe);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-recipes">
        <div className="container">
          <div className="loading page-recipes-loading">Loading recipe...</div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="page-recipes">
        <div className="container">
          <div className="error">
            <div className="error-title">Error</div>
            <div>{error || 'Recipe not found'}</div>
            <Link to="/recipes" className="btn-retry-recipes" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-recipes">
      <div className="container">
        <div className="recipe-detail-nav">
          <Link to="/recipes" className="back-link">
            ← Back to all recipes
          </Link>
        </div>

        <div className="recipe-detail-header recipe-detail-header-v1">
          <h1 className="recipe-detail-title recipe-detail-title-v1">{recipe.name}</h1>
          {recipe.url && (
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="external-recipe-link external-recipe-link-v1"
            >
              View full recipe on source website →
            </a>
          )}
          <div className="recipe-detail-total recipe-detail-total-v1">
            <span className="total-label">Total Protein</span>
            <span className="total-value total-value-v1">{recipe.totalProteinGrams.toFixed(1)}g</span>
          </div>
        </div>

        <div className="recipe-detail-content">
          <div className="card card-recipes-v1">
            <h2 className="card-title card-title-recipes-v1">Ingredients</h2>
            <div className="recipe-detail-ingredients">
              {recipe.ingredients.map((ingredient, idx) => (
                <div key={idx} className="recipe-detail-ingredient recipe-detail-ingredient-v1">
                  <div className="ingredient-info">
                    <div className="ingredient-name-large ingredient-name-v1">{ingredient.ingredientName}</div>
                    <div className="ingredient-amount ingredient-amount-v1">{ingredient.grams}g</div>
                  </div>
                  <div className="ingredient-protein-large ingredient-protein-v1">
                    {ingredient.proteinGrams.toFixed(1)}g protein
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
