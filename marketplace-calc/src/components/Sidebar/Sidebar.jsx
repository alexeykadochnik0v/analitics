import React, { useState, useRef, useEffect, memo } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
  HomeFilled, CalculatorFilled, HistoryOutlined, BarChartOutlined, 
  WalletOutlined, SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';

// Конфигурация маршрутов для сайдбара
const routes = [
  { path: '/', icon: <HomeFilled />, label: 'Дэшборд', exact: true },
  { path: '/calculator', icon: <CalculatorFilled />, label: 'Калькулятор' },
  { path: '/history', icon: <HistoryOutlined />, label: 'История' },
  { path: '/charts', icon: <BarChartOutlined />, label: 'Графики' },
  { path: '/finance', icon: <WalletOutlined />, label: 'Финансы' },
  { path: '/settings', icon: <SettingOutlined />, label: 'Настройки' },
];

/**
 * Компонент бургер-иконки с анимацией переключения
 * @param {Object} props - Пропсы компонента
 * @param {boolean} props.open - Состояние иконки (открыта/закрыта)
 * @returns {JSX.Element} Анимированная иконка
 */
const BurgerIcon = memo(({ open }) => {
  return (
    <div className={`burger-icon${open ? ' burger-icon--open' : ''}`} aria-label="Меню"> 
      <span />
      <span />
      <span />
    </div>
  );
});

/**
 * Компонент боковой панели навигации
 * Отвечает за отображение меню навигации и адаптивность для мобильных устройств
 * @returns {JSX.Element} Компонент сайдбара
 */
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Обработка клика вне сайдбара для закрытия мобильного меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && !collapsed && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.burger-icon')) {
        closeMobileMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, collapsed]);

  // Обновляем класс основного контента при изменении состояния сайдбара
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (!collapsed && !isMobile) {
        mainContent.classList.add('with-expanded-sidebar');
      } else {
        mainContent.classList.remove('with-expanded-sidebar');
      }
    }
  }, [collapsed, isMobile]);

  // Закрытие мобильного меню
  const closeMobileMenu = () => {
    setCollapsed(true);
    document.body.style.overflow = '';
  };

  // Обработка клика по ссылке в мобильном меню
  const handleLinkClick = () => {
    if (isMobile) {
      closeMobileMenu();
    }
  };

  // Обработка клика по бургер-иконке
  const handleBurgerClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    setCollapsed(prev => {
      const newState = !prev;
      // Блокируем прокрутку страницы при открытом мобильном меню
      if (isMobile) {
        document.body.style.overflow = newState ? 'hidden' : '';
      }
      return newState;
    });
  };

  // Обработка клика по клавише Enter или Space на бургер-иконке
  const handleBurgerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBurgerClick(e);
    }
  };

  // Рендерим компоненты
  const renderBurgerIcon = () => {
    if (!isMobile) return null;
    
    return (
      <div 
        className="burger-icon" 
        onClick={handleBurgerClick}
        onKeyDown={handleBurgerKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
      >
        <BurgerIcon open={!collapsed} />
      </div>
    );
  };

  const renderDesktopSidebar = () => (
    <aside
      ref={sidebarRef}
      className={`sidebar${!collapsed && !isMobile ? ' sidebar--expanded' : ''}`}
      tabIndex={-1}
      aria-label="Навигация"
    >
      <div className="sidebar-logo-block">
        <div className="sidebar-logo-icon">
          <CalculatorFilled style={{ fontSize: 28, color: '#C0FF4A' }} />
        </div>
        {(!collapsed || isMobile) && (
          <div className="sidebar-logo-text">
            <span className="brand-accent">M</span>P Calc
          </div>
        )}
      </div>
      
      {!isMobile && (
        <>
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
                  onClick={handleLinkClick}
                >
                  <span className="sidebar-link-icon">{r.icon}</span>
                  <span className={`sidebar-link-label${!collapsed ? ' expanded' : ''}`}>{r.label}</span>
                </NavLink>
              </Tooltip>
            ))}
          </nav>
          
          {/* Кнопка разворачивания/сворачивания сайдбара */}
          <div className="sidebar-toggle-container">
            <button 
              className="sidebar-toggle-btn"
              onClick={handleBurgerClick}
              aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
              title={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>
        </>
      )}
    </aside>
  );

  const renderMobileMenu = () => {
    if (!isMobile || collapsed) return null;
    
    return (
      <div className="sidebar-mobile-wrapper">
        <div className="sidebar-overlay" onClick={closeMobileMenu} />
        <div 
          ref={mobileMenuRef}
          className="sidebar sidebar--expanded"
          style={{ display: 'flex', zIndex: 1201, maxWidth: '100vw' }}
        >
          {/* Кнопка закрытия (крестик) в мобильном меню */}
          <button 
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Закрыть меню"
          >
            <span></span>
            <span></span>
          </button>
          
          <div className="sidebar-logo-block mobile-logo">
            <div className="sidebar-logo-icon">
              <CalculatorFilled style={{ fontSize: 28, color: '#C0FF4A' }} />
            </div>
            <div className="sidebar-logo-text">
              <span className="brand-accent">M</span>P Calc
            </div>
          </div>
          
          <nav className="sidebar-nav">
            {routes.map((r) => (
              <NavLink
                key={r.path}
                to={r.path}
                end={!!r.exact}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
                onClick={handleLinkClick}
              >
                <span className="sidebar-link-icon">{r.icon}</span>
                <span className="sidebar-link-label expanded">{r.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className="sidebar-container">
      {renderBurgerIcon()}
      {renderDesktopSidebar()}
      {renderMobileMenu()}
    </div>
  );
};

export default Sidebar;
