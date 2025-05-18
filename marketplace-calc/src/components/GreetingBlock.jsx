import React from 'react';
import './GreetingBlock.css';

const GreetingBlock = () => (
  <div className="dashboard-block" style={{ minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
  <div className="dashboard-block-title" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#181834', marginBottom: 8 }}>
    Добро <span style={{ color: '#b0ff38' }}>пожаловать!</span>
  </div>
  <div className="greeting-desc" style={{ fontSize: '1.22rem', color: '#7c3aed', fontWeight: 500, maxWidth: 400 }}>
    Быстрый <span style={{ color: '#7c3aed', fontWeight: 700 }}>расчёт прибыли</span>, <span style={{ color: '#4a90e2', fontWeight: 700 }}>маржи</span> и <span style={{ color: '#3ecf8e', fontWeight: 700 }}>себестоимости</span> — всё на одном дашборде.
  </div>
</div>
);

export default GreetingBlock;
