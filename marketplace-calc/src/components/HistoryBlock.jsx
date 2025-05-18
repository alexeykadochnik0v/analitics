import React, { useState } from 'react';
import { Tooltip, Modal } from 'antd';
import { FaChevronRight, FaHistory } from 'react-icons/fa';
import './HistoryBlock.css';

const HistoryBlock = ({ history = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Показываем только 7 записей, если не нажата кнопка "Показать ещё"
  const shownHistory = showAll ? history : history.slice(0, 7);
  const hasMore = history.length > 7;
  
  // Обработчик клика по элементу истории
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <div className="dashboard-block-title">
        <FaHistory style={{ marginRight: '8px' }} />
        История расчётов
      </div>
      
      {(!history || history.length === 0) ? (
        <div className="dashboard-block-placeholder">
          Нет ещё расчетов. Проведите первый — и история появится!
        </div>
      ) : (
        <>
          <ul className="dashboard-block-list">
            {shownHistory.map((item, idx) => (
              <li 
                key={idx} 
                className="history-list-item"
                onClick={() => handleItemClick(item)}
              >
                <span className="history-item-num">{`Расчёт №${history.length - idx}`}</span>
                <span className="history-item-title">{item.productName || item.product || 'Без названия'}</span>
                <span className="history-item-profit">{item.netProfit ?? item.profit ?? '—'} ₽</span>
                <span className="history-item-margin">{item.margin ?? '—'}%</span>
                <span className="history-item-date">{formatDate(item.date)}</span>
                <FaChevronRight className="history-item-arrow" />
              </li>
            ))}
          </ul>
          
          {hasMore && !showAll && (
            <button className="history-more-btn" onClick={() => setShowAll(true)}>
              Показать ещё
            </button>
          )}
        </>
      )}
      
      {/* Модальное окно с подробной информацией */}
      <Modal
        title={selectedItem ? `Расчёт: ${selectedItem?.productName || selectedItem?.product || 'Без названия'}` : 'Детали расчёта'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <div className="history-detail">
            <div className="history-detail-row">
              <span className="history-detail-label">Товар:</span>
              <span className="history-detail-value">{selectedItem.productName || selectedItem.product || 'Без названия'}</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">Чистая прибыль:</span>
              <span className="history-detail-value profit">{selectedItem.netProfit ?? selectedItem.profit ?? '—'} ₽</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">Маржинальность:</span>
              <span className="history-detail-value margin">{selectedItem.margin ?? '—'}%</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">Себестоимость:</span>
              <span className="history-detail-value">{selectedItem.costPrice ?? '—'} ₽</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">Оборотка:</span>
              <span className="history-detail-value">{selectedItem.workingCapital ?? '—'} ₽</span>
            </div>
            <div className="history-detail-row">
              <span className="history-detail-label">Дата расчёта:</span>
              <span className="history-detail-value">{formatDate(selectedItem.date)}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};


export default HistoryBlock;
