import type { MealEntry } from '../types';

interface MealBuilderSectionProps {
  enabled: boolean;
  onToggle: () => void;
  items: MealEntry[];
  totalProteinGrams: number;
  dailyGoalGrams: number;
  onRemoveEntry: (entryId: string) => void;
}

export function MealBuilderSection({
  enabled,
  onToggle,
  items,
  totalProteinGrams,
  dailyGoalGrams,
  onRemoveEntry,
}: MealBuilderSectionProps) {

  const percentOfGoal =
    dailyGoalGrams > 0
      ? Math.round((totalProteinGrams / dailyGoalGrams) * 100)
      : 0;
  const encourageMessage =
    items.length === 0
      ? 'Add something when you\'re ready — even one item helps.'
      : percentOfGoal >= 100
        ? 'You hit your goal today! 🎉'
        : percentOfGoal >= 50
          ? `About ${percentOfGoal}% of your goal — you're doing great!`
          : `About ${percentOfGoal}% of your goal — nice start! 🌱`;

  return (
    <>
      <div className="meal-builder-row">
        <span className="toggle-label">Build today&apos;s meal</span>
        <button
          type="button"
          className={`toggle-switch ${enabled ? 'on' : ''}`}
          onClick={onToggle}
          role="switch"
          aria-checked={enabled}
          aria-label="Build today's meal"
        />
      </div>
      {enabled && (
        <div className="meal-summary">
          <h3>Today&apos;s plate</h3>
          <p className="meal-summary-sub">What you&apos;ve logged so far</p>
          {items.length === 0 ? (
            <div className="meal-summary-list">Nothing logged yet</div>
          ) : (
            <ul className="meal-summary-list meal-summary-entries" aria-label="Logged items">
              {items.map((entry) => (
                <li key={entry.id} className="meal-summary-entry">
                  <span>
                    {entry.grams}g {entry.name}
                    <span className="meal-summary-entry-protein">
                      {' '}({entry.proteinGrams.toFixed(0)}g protein)
                    </span>
                  </span>
                  <button
                    type="button"
                    className="meal-summary-remove"
                    onClick={() => onRemoveEntry(entry.id)}
                    aria-label={`Remove ${entry.grams}g ${entry.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="meal-summary-total">
            {totalProteinGrams.toFixed(1)}g protein
            {dailyGoalGrams > 0 && (
              <span className="meal-summary-goal"> (of {Math.round(dailyGoalGrams)}g goal)</span>
            )}
          </div>
          <p className="meal-summary-encourage">{encourageMessage}</p>
        </div>
      )}
    </>
  );
}
