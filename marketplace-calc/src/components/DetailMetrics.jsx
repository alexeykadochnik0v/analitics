import React from 'react';

// Детализация расходов под KPI-карточками
const DetailMetrics = ({ results }) => {
  if (!results) return null;
  return (
    <div style={{ marginTop: 24, padding: 16, background: '#fafbfc', borderRadius: 12, border: '1px solid #ececec' }}>
      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16 }}>Детализация расходов</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 15 }}>
        <li>Прибыль за месяц: <b>{results.profitMonth} ₽</b></li>
        <li>Комиссия Ozon: <b>{results.ozonCommission} ₽</b></li>
        <li>Эквайринг: <b>{results.acquiringFee} ₽</b></li>
        <li>Обработка и доставка: <b>{results.processingAndDelivery} ₽</b></li>
        <li>Возвраты и отмены: <b>{results.returnsAndCancels} ₽</b></li>
        <li>Прочие затраты: <b>{results.otherCosts} ₽</b></li>
        <li>Налог: <b>{results.taxAmount} ₽</b></li>
        <li>Выкуп, %: <b>{results.buyoutPercent}</b></li>
      </ul>
    </div>
  );
};

export default DetailMetrics;
