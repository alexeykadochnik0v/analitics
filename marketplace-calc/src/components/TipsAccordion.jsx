import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

const TIPS = [
  'Используй фильтры для анализа трендов',
  'Добавь события в календарь',
  'Сравни прибыль по товарам',
];

export default function TipsAccordion() {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(Array(TIPS.length).fill(false));
  const allChecked = checked.every(Boolean);

  return (
    <div className={`tips-accordion-premium${open ? ' tips-accordion-premium--open' : ''}`}>
      <div
        className={`tips-accordion-header${allChecked ? ' tips-accordion-header--done' : ''}`}
        onClick={() => setOpen(o => !o)}
        tabIndex={0}
        role="button"
        aria-expanded={open}
      >
        <FaLightbulb className={`tips-accordion-icon${allChecked ? ' tips-accordion-icon--done' : ''}`} />
        <span>Советы и чеклист</span>
        {allChecked && <span className="tips-accordion-congrats">Молодец!</span>}
        <span className="tips-accordion-arrow">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <ul className="tips-accordion-list">
          {TIPS.map((tip, idx) => (
            <li key={idx} className="tips-accordion-list-item">
              <label className="tips-accordion-label">
                <input
                  type="checkbox"
                  checked={checked[idx]}
                  onChange={e => {
                    const next = [...checked];
                    next[idx] = e.target.checked;
                    setChecked(next);
                  }}
                  className="tips-accordion-checkbox"
                />
                <span className={checked[idx] ? 'tips-accordion-tip-done' : ''}>{tip}</span>
              </label>
            </li>
          ))}
          <li className="tips-accordion-progress-row">
            <div className="tips-accordion-progress-bar">
              <div
                className="tips-accordion-progress-bar-fill"
                style={{ width: `${(checked.filter(Boolean).length / TIPS.length) * 100}%` }}
              />
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
