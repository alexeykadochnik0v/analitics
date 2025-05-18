import React, { useState } from 'react';
import { Tooltip, Modal } from 'antd';
import { FaChevronRight, FaHistory } from 'react-icons/fa';
import './HistoryBlock.css';

const HistoryBlock = ({ history = [] }) => {
  // Функция: расчет "свежести" (меньше 1 дня)
  const isNew = (dateString) => {
    if (!dateString) return false;
    const now = new Date();
    const date = new Date(dateString);
    return (now - date) < 24 * 60 * 60 * 1000;
  };
  // Функция: цвет прибыли
  const getProfitColor = (profit) => {
    const val = Number(profit);
    if (isNaN(val)) return '';
    if (val > 0) return 'profit-green';
    if (val < 0) return 'profit-red';
    return 'profit-gray';
  };

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
                className="history-list-item compact"
                onClick={() => handleItemClick(item)}
              >
                <div className="history-row-main">
                  <div className="history-item-title">
                    {item.productName || item.product || 'Без названия'}
                    {isNew(item.date) && <span className="history-item-new">NEW</span>}
                  </div>
                  <div className="history-item-stats">
                    <span className={`history-item-profit ${getProfitColor(item.profit ?? item.netProfit)}`}>{item.profit ?? item.netProfit ?? '—'} ₽</span>
                    <span className="history-item-margin history-item-margin-colored">{item.margin ?? '—'}%</span>
                  </div>
                </div>
                <div className="history-row-date">
                  <span className="history-item-date">{formatDate(item.date)}</span>
                </div>
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
            {(Number(selectedItem.profit ?? selectedItem.netProfit) === 0 && Number(selectedItem.margin) === 0) ? (
              <div className="history-detail-empty">Данные по этому расчету отсутствуют или расчет не был произведен. Заполните все поля калькулятора.</div>
            ) : (
              <>
                <div className="history-detail-row">
                  <span className="history-detail-label">Товар:</span>
                  <span className="history-detail-value">{selectedItem.productName || selectedItem.product || 'Без названия'}</span>
                </div>
                <div className="history-detail-row">
                  <span className="history-detail-label">Чистая прибыль:</span>
                  <span className={`history-detail-value profit ${getProfitColor(selectedItem.profit ?? selectedItem.netProfit)}`}>{selectedItem.profit ?? selectedItem.netProfit ?? '—'} ₽</span>
                </div>
                <div className="history-detail-row">
                  <span className="history-detail-label">Маржинальность:</span>
                  <span className="history-detail-value margin">{selectedItem.margin ?? '—'}%</span>
                </div>
                <div className="history-detail-row">
                  <span className="history-detail-label">Себестоимость:</span>
                  <span className="history-detail-value">{selectedItem.cost ?? '—'} ₽</span>
                </div>
                <div className="history-detail-row">
                  <span className="history-detail-label">Оборотка:</span>
                  <span className="history-detail-value">{selectedItem.turnover ?? '—'} ₽</span>
                </div>
                <div className="history-detail-row">
                  <span className="history-detail-label">Дата расчёта:</span>
                  <span className="history-detail-value">{formatDate(selectedItem.date)}</span>
                </div>
                <div className="history-detail-row"><b>Детализация расходов:</b></div>
                <div className="history-detail-row"><span>Комиссия МП:</span> <span>{selectedItem.ozonCommission ?? '—'} ₽</span></div>
                <div className="history-detail-row"><span>Эквайринг:</span> <span>{selectedItem.acquiringFee ?? '—'} ₽</span></div>
                <div className="history-detail-row"><span>Обработка и доставка:</span> <span>{selectedItem.processingAndDelivery ?? '—'} ₽</span></div>
                <div className="history-detail-row"><span>Возвраты и отмены:</span> <span>{selectedItem.returnsAndCancels ?? '—'} ₽</span></div>
                <div className="history-detail-row"><span>Прочие затраты:</span> <span>{selectedItem.otherCosts ?? '—'} ₽</span></div>
                <div className="history-detail-row"><span>Налог:</span> <span>{selectedItem.taxAmount ?? '—'} ₽</span></div>
                <div className="history-detail-row"><span>Выкуп, %:</span> <span>{selectedItem.buyoutPercent ?? '—'}</span></div>
                <div className="history-detail-row"><span>Продаж в месяц:</span> <span>{selectedItem.salesCount ?? '—'}</span></div>
                <div className="history-detail-row history-detail-signature">*Все значения расчетные. Уточняйте данные перед заказом на МП.</div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};


export default HistoryBlock;
