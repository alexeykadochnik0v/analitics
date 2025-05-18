import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import './DashboardMetrics.css';

const METRICS_CONFIG = [
  {
    key: 'netProfit',
    label: 'Чистая прибыль',
    icon: '💰',
    color: '#2ecc40',
    bg: '#eaffed',
    placeholder: '—',
    tooltip: 'Это ваша чистая прибыль за расчет.'
  },
  {
    key: 'margin',
    label: 'Маржинальность',
    icon: '📈',
    color: '#3b82f6',
    bg: '#f0f6ff',
    placeholder: '—',
    tooltip: 'Процент маржинальности по формуле.'
  },
  {
    key: 'costPrice',
    label: 'Себестоимость 1 ед.',
    icon: '⚙️',
    color: '#a259ff',
    bg: '#f6f0ff',
    placeholder: '—',
    tooltip: 'Себестоимость одной единицы товара.'
  },
  {
    key: 'workingCapital',
    label: 'Оборотка',
    icon: '🔄',
    color: '#ffd600',
    bg: '#fffde7',
    placeholder: '—',
    tooltip: 'Общий оборот по партии.'
  }
];

const formatValue = (key, value) => {
  if (value === undefined || value === null || isNaN(value)) return '—';
  if (key === 'margin') return `${Number(value).toFixed(2)}%`;
  return `${Number(value).toLocaleString()} ₽`;
};

const DashboardMetrics = ({ results }) => {
  return (
    <div className="metrics-grid">
      {METRICS_CONFIG.map((m, idx) => {
        const val = results ? results[m.key] : undefined;
        return (
          <motion.div
            className="metric-card"
            key={m.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.07 }}
            style={{
              '--metric-color': m.color,
              '--metric-bg': m.bg,
            }}
            title={m.tooltip}
            aria-label={`${m.label}: ${formatValue(m.key, val)}`}
          >
            <div className="metric-icon" style={{ color: m.color, background: `linear-gradient(90deg, #f3f0ff 0%, ${m.color} 100%)` }}>
              {m.icon}
            </div>
            <div className="metric-value">
              <AnimatePresence mode="wait">
                <motion.span
                  key={val}
                  initial={{ backgroundColor: '#f3f0ff' }}
                  animate={{ backgroundColor: 'rgba(176,255,56,0.13)' }}
                  exit={{ backgroundColor: '#f3f0ff' }}
                  transition={{ duration: 0.7 }}
                  style={{ display: 'inline-block', borderRadius: 8, padding: '0 6px' }}
                >
                  <CountUp
                    end={typeof val === 'number' ? val : 0}
                    duration={1.2}
                    separator=" "
                    decimals={m.key === 'margin' ? 2 : 0}
                    preserveValue
                    formattingFn={v => (val === undefined || val === null || isNaN(val)) ? m.placeholder : (m.key === 'margin' ? `${v}%` : `${Number(v).toLocaleString()} ₽`)}
                  />
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-tooltip">{m.tooltip}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
