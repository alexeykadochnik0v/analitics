import React, { useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import HistoryBlock from '../../components/HistoryBlock';
import DashboardChart from '../../components/DashboardChart';
import { FaChartLine, FaPercentage, FaExchangeAlt } from 'react-icons/fa';
import DashboardMetrics from '../../components/DashboardMetrics';
import SupplyCalendar from '../../components/SupplyCalendar';
import './DashboardPage.css';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('mpcalc_lastResults') || '[]');
  } catch {
    return [];
  }
}


const DashboardPage = ({ user }) => {
  const [history, setHistory] = useState(getHistory());
  const [activeChartTab, setActiveChartTab] = useState('profit');
  
  React.useEffect(() => {
    const update = () => setHistory(getHistory());
    window.addEventListener('storage', update);
    window.addEventListener('focus', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('focus', update);
    };
  }, []);
  
  const lastResult = history[0] || {};
  const goal = 100000;
  const progress = lastResult.netProfit ? Math.min(Math.round((lastResult.netProfit / goal) * 100), 100) : 0;
  
  const chartTabs = [
    { key: 'profit', label: 'Прибыль', icon: <FaChartLine /> },
    { key: 'margin', label: 'Маржа', icon: <FaPercentage /> },
    { key: 'turnover', label: 'Оборотка', icon: <FaExchangeAlt /> }
  ];

  return (
    <div className="dashboard-root">
      <DashboardHeader user={user} goal={goal} progress={progress} />
      
      {/* KPI-карточки */}
      <DashboardMetrics results={lastResult} />
      
      {/* График и История */}
      <div className="dashboard-main-section">
        <div className="dashboard-chart-container">
          <div className="dashboard-chart-header">
            <div className="dashboard-chart-tabs">
              {chartTabs.map(tab => (
                <button 
                  key={tab.key}
                  className={`dashboard-chart-tab ${activeChartTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveChartTab(tab.key)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="dashboard-chart-content">
            <DashboardChart data={history} type={activeChartTab} />
          </div>
        </div>
        
        <div className="dashboard-history-container">
          <HistoryBlock history={history} />
        </div>
      </div>
      
      {/* Календарь поставок */}
      <div className="dashboard-calendar-section">
        <SupplyCalendar />
      </div>
    </div>
  );
};

export default DashboardPage;
