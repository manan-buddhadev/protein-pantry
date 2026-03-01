import type { ActivityLevel } from '../types';

interface CalculatorHeroProps {
  weightKg: number;
  onWeightChange: (kg: number) => void;
  unit: 'kg' | 'lbs';
  onUnitChange: (u: 'kg' | 'lbs') => void;
  activity: ActivityLevel;
  onActivityChange: (a: ActivityLevel) => void;
  dailyGoalGrams: number;
  /** When set (e.g. Advanced Mode on), hero shows meal total and ratio to goal. */
  mealTotalProteinGrams?: number;
}

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  light: 'Light',
  moderate: 'Moderate',
  active: 'Active',
  intense: 'Intense',
};

export function CalculatorHero({
  weightKg,
  onWeightChange,
  unit,
  onUnitChange,
  activity,
  onActivityChange,
  dailyGoalGrams,
  mealTotalProteinGrams,
}: CalculatorHeroProps) {
  const displayWeight = unit === 'lbs' ? weightKg * 2.205 : weightKg;
  const handleWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v)) {
      const kg = unit === 'lbs' ? v / 2.205 : v;
      onWeightChange(kg);
    }
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' };
    return { text: 'Good evening', emoji: '🌙' };
  })();

  return (
    <div className="hero-section">
      <p className="greeting">
        <span className="greeting-emoji">{greeting.emoji}</span>
        {greeting.text}
      </p>
      <div className="hero-metric">
        <div className="hero-label">
          {mealTotalProteinGrams !== undefined
            ? 'This meal / daily goal'
            : 'Your daily protein goal'}
        </div>
        <div className="hero-value">
          {mealTotalProteinGrams !== undefined ? (
            <>
              {mealTotalProteinGrams.toFixed(0)}g / {Math.round(dailyGoalGrams)}g
            </>
          ) : (
            <>~{Math.round(dailyGoalGrams)}g</>
          )}
        </div>
      </div>
      <p className="hero-encourage">
        Small steps add up. You&apos;ve got this.
      </p>
      <div className="hero-inputs">
        <div className="input-group">
          <label htmlFor="weight">Weight</label>
          <div className="weight-row">
            <input
              id="weight"
              type="number"
              min="1"
              max={unit === 'kg' ? 300 : 660}
              step={unit === 'kg' ? 1 : 2}
              value={Math.round(displayWeight * 10) / 10}
              onChange={handleWeightInput}
              aria-label="Weight"
            />
            <div className="unit-chips">
              <button
                type="button"
                className={unit === 'kg' ? 'active' : ''}
                onClick={() => onUnitChange('kg')}
                aria-pressed={unit === 'kg'}
              >
                kg
              </button>
              <button
                type="button"
                className={unit === 'lbs' ? 'active' : ''}
                onClick={() => onUnitChange('lbs')}
                aria-pressed={unit === 'lbs'}
              >
                lbs
              </button>
            </div>
          </div>
        </div>
        <div className="input-group">
          <label>Activity</label>
          <div className="activity-row">
            {(['light', 'moderate', 'active', 'intense'] as const).map((level) => (
              <button
                key={level}
                type="button"
                className={activity === level ? 'active' : ''}
                onClick={() => onActivityChange(level)}
                aria-pressed={activity === level}
              >
                {ACTIVITY_LABELS[level]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
