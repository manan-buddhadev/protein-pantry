import { useState, useEffect } from 'react';
import type { ActivityLevel } from '../types';

interface CalculatorHeroProps {
  weightKg: number;
  onWeightChange: (kg: number) => void;
  unit: 'kg' | 'lbs';
  onUnitChange: (u: 'kg' | 'lbs') => void;
  activity: ActivityLevel;
  onActivityChange: (a: ActivityLevel) => void;
  dailyGoalGrams: number;
}

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  light: 'Light',
  active: 'Active',
  muscleGain: 'Muscle Gain',
};

export function CalculatorHero({
  weightKg,
  onWeightChange,
  unit,
  onUnitChange,
  activity,
  onActivityChange,
  dailyGoalGrams,
}: CalculatorHeroProps) {
  const displayWeight = unit === 'lbs' ? weightKg * 2.205 : weightKg;
  const [inputValue, setInputValue] = useState(String(Math.round(displayWeight * 10) / 10));

  useEffect(() => {
    setInputValue(String(Math.round(displayWeight * 10) / 10));
  }, [displayWeight, unit]);

  const handleWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const v = parseFloat(value);
    if (!Number.isNaN(v) && v > 0) {
      const kg = unit === 'lbs' ? v / 2.205 : v;
      onWeightChange(kg);
    }
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
    return { text: 'Good Evening', emoji: '🌙' };
  })();

  return (
    <div className="hero-section">
      <p className="greeting">
        <span className="greeting-emoji">{greeting.emoji}</span>
        {greeting.text}
      </p>
      <div className="hero-metric">
        <div className="hero-label">
          Your minimum daily protein goal
        </div>
        <div className="hero-value">
          ~{Math.round(dailyGoalGrams)}g
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
              value={inputValue}
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
            {(['light', 'active', 'muscleGain'] as const).map((level) => (
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
