import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
  HomeFilled, CalculatorFilled, HistoryOutlined, BarChartOutlined, WalletOutlined, SettingOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';

const routes = [
  { path: '/', icon: <HomeFilled />, label: 'Дэшборд', exact: true },
  { path: '/calculator', icon: <CalculatorFilled />, label: 'Калькулятор' },
  { path: '/history', icon: <HistoryOutlined />, label: 'История' },
  { path: '/charts', icon: <BarChartOutlined />, label: 'Графики' },
  { path: '/finance', icon: <WalletOutlined />, label: 'Финансы' },
  { path: '/settings', icon: <SettingOutlined />, label: 'Настройки' },
];

function BurgerIcon({ open }) {
  // Animated burger/cross icon
  return (
    <span className={`burger-icon${open ? ' burger-icon--open' : ''}`}> 
      <span />
      <span />
      <span />
    </span>
  );
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);

  // Responsive: collapse by default on ≤900px, drawer on ≤600px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Обработка клика вне сайдбара для закрытия на мобильных устройствах
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 600 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.burger-icon')) {
        setCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Обновляем класс основного контента при изменении состояния сайдбара
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (!collapsed && window.innerWidth > 900) {
        mainContent.classList.add('with-expanded-sidebar');
      } else {
        mainContent.classList.remove('with-expanded-sidebar');
      }
    }
  }, [collapsed]);
  
  const handleBurgerClick = () => {
    setCollapsed((c) => !c);
  };

  return (
    <>
      <div className="burger-icon" onClick={handleBurgerClick}>
        <BurgerIcon open={!collapsed} />
      </div>
      <aside
        ref={sidebarRef}
        className={`sidebar${!collapsed ? ' sidebar--expanded' : ''}`}
        tabIndex={-1}
      >
        <div className="sidebar-logo-block">
          <div className="sidebar-logo-icon">
            <CalculatorFilled style={{ fontSize: 28, color: '#C0FF4A' }} />
          </div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span className="brand-accent">M</span>P Calc
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          {routes.map((r) => (
            <Tooltip 
              key={r.path} 
              title={collapsed ? r.label : ''} 
              placement="right"
              mouseEnterDelay={0.5}
            >
              <NavLink
                to={r.path}
                end={!!r.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                <span className="sidebar-link-icon">{r.icon}</span>
                <span className={`sidebar-link-label${!collapsed ? ' expanded' : ''}`}>{r.label}</span>
              </NavLink>
            </Tooltip>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Tooltip 
            title={collapsed ? "Скачать отчёт" : ''} 
            placement="right"
            mouseEnterDelay={0.5}
          >
            <button className="sidebar-download">
              <DownloadOutlined style={{ fontSize: 20 }} />
              {!collapsed && <span>Скачать отчёт</span>}
            </button>
          </Tooltip>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
