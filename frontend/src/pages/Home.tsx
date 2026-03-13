import { useState, useEffect, useMemo } from 'react';
import { fetchIngredients } from '../api';
import type { Ingredient, ActivityLevel } from '../types';
import { PROTEIN_PER_KG } from '../constants';
import { CalculatorHero } from '../components/CalculatorHero';
import { IngredientCardGrid } from '../components/IngredientCardGrid';

export function Home() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [weightKg, setWeightKg] = useState(70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [activity, setActivity] = useState<ActivityLevel>('active');

  const dailyGoalGrams = useMemo(() => {
    const multiplier = PROTEIN_PER_KG[activity];
    return Math.round(weightKg * multiplier);
  }, [weightKg, activity]);

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
            />

            <IngredientCardGrid
              ingredients={ingredients}
              dailyGoalGrams={dailyGoalGrams}
            />
          </>
        )}
      </div>
    </div>
  );
}
