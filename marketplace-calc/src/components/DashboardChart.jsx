import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart
} from 'recharts';

const metrics = {
  profit: { key: 'netProfit', label: 'Прибыль', color: '#2ecc40', gradient: 'url(#barGradientProfit)' },
  margin: { key: 'margin', label: 'Маржа', color: '#a259ff', gradient: 'url(#barGradientMargin)' },
  turnover: { key: 'workingCapital', label: 'Оборотка', color: '#ffd600', gradient: 'url(#barGradientTurnover)' }
};

export default function DashboardChart({ data, type = 'profit', goal }) {
  const [chartData, setChartData] = useState([]);
  const [currentMetric, setCurrentMetric] = useState(metrics[type] || metrics.profit);

  // Обновляем данные графика при изменении типа или данных
  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      return;
    }
    
    // Преобразуем данные для графика
    const formattedData = data.map(item => ({
      name: item.productName || item.product || item.date || 'N/A',
      netProfit: item.netProfit || 0,
      margin: item.margin || 0,
      workingCapital: item.workingCapital || 0,
      date: item.date
    }));
    
    setChartData(formattedData);
    setCurrentMetric(metrics[type] || metrics.profit);
  }, [data, type]);

  return (
    <>
      {chartData.length === 0 ? (
        <div className="dashboard-chart-empty">
          <p>График появится после первых расчетов</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          {type === 'margin' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="barGradientProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#2ecc40" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="barGradientMargin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a259ff" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="barGradientTurnover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ffd600" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  borderRadius: 12, 
                  border: '1px solid #e5e7ef', 
                  color: '#232946', 
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value}%`, currentMetric.label]}
              />
              <Area 
                type="monotone" 
                dataKey={currentMetric.key} 
                stroke={currentMetric.color} 
                fill={currentMetric.gradient} 
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="barGradientProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#2ecc40" />
                </linearGradient>
                <linearGradient id="barGradientMargin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#a259ff" />
                </linearGradient>
                <linearGradient id="barGradientTurnover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ffd600" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  borderRadius: 12, 
                  border: '1px solid #e5e7ef', 
                  color: '#232946', 
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value} ₽`, currentMetric.label]}
              />
              {goal && type === 'profit' && (
                <line
                  x1="0" x2="100%" y1={goal} y2={goal}
                  stroke="#b0ff38" strokeDasharray="6 3" strokeWidth={2}
                />
              )}
              <Bar
                dataKey={currentMetric.key}
                fill={currentMetric.gradient}
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </>
  );
}

