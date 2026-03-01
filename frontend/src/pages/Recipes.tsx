import { useState, useEffect, useMemo } from 'react';
import { RecipeList } from '../components/RecipeList';
import { fetchRecipes } from '../api';
import { Recipe } from '../types';

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Sort alphabetically by name
    result.sort((a, b) => a.name.localeCompare(b.name));
    
    return result;
  }, [recipes, searchTerm]);

  return (
    <div className="page-recipes">
      <div className="container">
        <div className="page-header page-recipes-header">
          <h1 className="page-title page-recipes-title">Recipes</h1>
        </div>

        {error && (
          <div className="error">
            <div className="error-title">Error</div>
            <div>{error}</div>
            <button
              onClick={loadRecipes}
              className="btn-retry-recipes"
            >
              Retry
            </button>
          </div>
        )}

        {loading && <div className="loading page-recipes-loading">Loading recipes...</div>}

        {!loading && !error && (
          <>
            <div className="search-box page-recipes-search">
              <input
                type="text"
                placeholder="Search recipes by name or ingredient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Search recipes"
              />
              {filteredRecipes.length > 0 && (
                <div className="page-recipes-count">
                  {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="empty-state">
                <p>No recipes found matching &quot;{searchTerm}&quot;</p>
              </div>
            ) : (
              <RecipeList recipes={filteredRecipes} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
