import React, { useState } from 'react';
import { Typography } from 'antd';

const tipsData = [
  'Проверяйте себестоимость перед запуском рекламы.',
  'Добавьте фото/видео для повышения конверсии.',
  'Следите за изменениями комиссий маркетплейса.',
  'Используйте промоакции для увеличения продаж.'
];

const TipsBlock = () => {
  const [checked, setChecked] = useState(Array(tipsData.length).fill(false));

  const toggle = idx => {
    setChecked(arr => arr.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="tips-card dashboard-block" style={{ marginTop: 28, minHeight: 140, maxWidth: 600, background: '#fff', border: '1.5px solid #b0ff38', borderRadius: 22, padding: '24px 18px', boxSizing: 'border-box', display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span className="dashboard-block-tip-icon" role="img" aria-label="bulb" style={{ fontSize: 28, color: '#ffd600', marginRight: 6 }}>💡</span>
        Советы
      </div>
      {tipsData.length === 0 ? (
        <div className="dashboard-block-placeholder">Пока нет советов.</div>
      ) : (
        <ul className="dashboard-block-tip-list" style={{ gap: 18 }}>
          {tipsData.map((tip, idx) => (
            <li
              key={idx}
              className="dashboard-block-tip-item tip-list-item"
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '8px 0', cursor: 'pointer', borderRadius: 10, transition: 'background 0.18s, box-shadow 0.18s', lineHeight: 1.5 }}
              onClick={() => toggle(idx)}
              tabIndex={0}
            >
              <span
                className="tip-checkbox"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: checked[idx] ? '2.5px solid #7c3aed' : '2.5px solid #e6e6e6',
                  background: checked[idx] ? '#f6f0ff' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 7,
                  boxShadow: checked[idx] ? '0 2px 8px #b0aaff33' : 'none',
                  transition: 'border 0.18s, background 0.18s, box-shadow 0.18s',
                  cursor: 'pointer',
                }}
                aria-checked={checked[idx]}
                role="checkbox"
              >
                {checked[idx] && (
                  <span style={{ fontSize: 16, color: '#7c3aed', fontWeight: 700 }}>✔</span>
                )}
              </span>
              <Typography.Text style={{ fontSize: 16, color: '#23234c', lineHeight: 1.5 }}>{tip}</Typography.Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TipsBlock;
