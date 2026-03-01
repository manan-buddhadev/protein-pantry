import { useState, useEffect, useMemo } from 'react';
import { fetchIngredients } from '../api';
import type { Ingredient, ActivityLevel } from '../types';
import { PROTEIN_PER_KG } from '../constants';
import { useMealBuilderStore, selectTotalMealProteinGrams } from '../store/mealBuilderStore';
import { CalculatorHero } from '../components/CalculatorHero';
import { MealBuilderSection } from '../components/MealBuilderSection';
import { IngredientCardGrid } from '../components/IngredientCardGrid';

export function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [weightKg, setWeightKg] = useState(70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const advancedModeEnabled = useMealBuilderStore((s) => s.advancedModeEnabled);
  const mealEntries = useMealBuilderStore((s) => s.mealEntries);
  const toggleAdvancedMode = useMealBuilderStore((s) => s.toggleAdvancedMode);
  const addEntryToMeal = useMealBuilderStore((s) => s.addEntryToMeal);
  const removeEntry = useMealBuilderStore((s) => s.removeEntry);

  const dailyGoalGrams = useMemo(() => {
    const multiplier = PROTEIN_PER_KG[activity];
    return Math.round(weightKg * multiplier);
  }, [weightKg, activity]);

  const mealTotalProtein = useMemo(
    () => selectTotalMealProteinGrams(mealEntries),
    [mealEntries]
  );

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchIngredients();
      setIngredients(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load ingredients'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-calculator">
      <div className="container">
        {error && (
          <div className="error">
            <div className="error-title">Error</div>
            <div>{error}</div>
            <button
              onClick={loadIngredients}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--saffron)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="loading" style={{ color: 'var(--brown-muted)' }}>
            Loading ingredients...
          </div>
        )}

        {!loading && !error && (
          <>
            <CalculatorHero
              weightKg={weightKg}
              onWeightChange={setWeightKg}
              unit={unit}
              onUnitChange={setUnit}
              activity={activity}
              onActivityChange={setActivity}
              dailyGoalGrams={dailyGoalGrams}
              mealTotalProteinGrams={advancedModeEnabled ? mealTotalProtein : undefined}
            />

            <div className="tip-strip" role="status">
              <span className="tip-emoji" aria-hidden>💡</span>
              <span>
                Logging even one meal helps you stay on track. No pressure — every bit counts.
              </span>
            </div>

            <MealBuilderSection
              enabled={advancedModeEnabled}
              onToggle={toggleAdvancedMode}
              items={mealEntries}
              totalProteinGrams={mealTotalProtein}
              dailyGoalGrams={dailyGoalGrams}
              onRemoveEntry={removeEntry}
            />

            <IngredientCardGrid
              ingredients={ingredients}
              dailyGoalGrams={dailyGoalGrams}
              mealBuilderEnabled={advancedModeEnabled}
              onAddToMeal={addEntryToMeal}
            />
          </>
        )}
      </div>
    </div>
  );
}
