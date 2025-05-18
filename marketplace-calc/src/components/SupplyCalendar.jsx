import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Button, Form, Input, Select, DatePicker, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { FaTruck, FaBoxOpen, FaCreditCard, FaExclamationTriangle, FaCalendarAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './SupplyCalendar.css';

const EVENT_TYPES = [
  { value: 'arrival', label: 'Привоз', icon: <FaTruck />, color: '#a6ff4d' },
  { value: 'shipment', label: 'Отгрузка', icon: <FaBoxOpen />, color: '#b490ff' },
  { value: 'payment', label: 'Оплата', icon: <FaCreditCard />, color: '#3b82f6' },
  { value: 'warning', label: 'Важно', icon: <FaExclamationTriangle />, color: '#ffadad' },
];

const SupplyCalendar = () => {
  const [events, setEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mpcalc_supplyEvents') || '[]');
    } catch {
      return [];
    }
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  
  useEffect(() => {
    localStorage.setItem('mpcalc_supplyEvents', JSON.stringify(events));
  }, [events]);

  // Список событий на ближайшие 7 дней
  const upcoming = events
    .filter(e => dayjs(e.date).isAfter(dayjs().subtract(1, 'day')) && dayjs(e.date).isBefore(dayjs().add(8, 'day')))
    .sort((a, b) => dayjs(a.date) - dayjs(b.date));

  const cellRender = (current, info) => {
    if (info.type !== 'date') return null;
    
    const dateStr = current.format('YYYY-MM-DD');
    const dateEvents = events.filter(event => event.date === dateStr);
    
    if (dateEvents.length === 0) return null;
    
    // Если есть события, добавляем специальный класс для ячейки с событиями
    const eventTypes = dateEvents.map(event => {
      return EVENT_TYPES.find(type => type.value === event.type) || EVENT_TYPES[0];
    });
    
    return (
      <div className="calendar-cell-with-events">
        {eventTypes.slice(0, 2).map((eventType, index) => (
          <div 
            key={index} 
            className="calendar-event-dot"
            style={{ backgroundColor: eventType.color }}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick(dateEvents[index]);
            }}
          />
        ))}
        {dateEvents.length > 2 && (
          <div className="calendar-event-more">+{dateEvents.length - 2}</div>
        )}
      </div>
    );
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsEditMode(false);
    setSelectedEvent(null);
    form.setFieldsValue({
      date: date,
      type: 'arrival',
      title: '',
      description: ''
    });
    setIsModalVisible(true);
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    form.setFieldsValue({
      date: dayjs(event.date),
      type: event.type,
      title: event.title,
      description: event.description
    });
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (isEditMode && selectedEvent) {
      // Обновление существующего события
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? {
          ...event,
          date: values.date.format('YYYY-MM-DD'),
          type: values.type,
          title: values.title,
          description: values.description
        } : event
      );
      setEvents(updatedEvents);
    } else {
      // Создание нового события
      const newEvent = {
        id: Date.now(),
        date: values.date.format('YYYY-MM-DD'),
        type: values.type,
        title: values.title,
        description: values.description
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
    }
    
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      setEvents(updatedEvents);
      setIsModalVisible(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3 className="calendar-title">
          <FaCalendarAlt style={{ marginRight: '8px' }} />
          Календарь поставок
        </h3>
        <div className="calendar-controls">
          <button 
            className="calendar-nav-btn" 
            onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
          >
            ←
          </button>
          <span className="calendar-current-month">
            {currentMonth.format('MMMM YYYY')}
          </span>
          <button 
            className="calendar-nav-btn" 
            onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
          >
            →
          </button>
        </div>
      </div>
      
      <div className="calendar-content">
        <div className="calendar-main">
          <Calendar
            cellRender={cellRender}
            fullscreen={false}
            onSelect={handleDayClick}
            className="calendar-widget"
            headerRender={null}
            value={currentMonth}
            onChange={setCurrentMonth}
          />
        </div>
        
        <div className="calendar-events">
          <h4 className="calendar-events-title">Ближайшие события:</h4>
          <ul className="calendar-upcoming-list">
            {upcoming.length === 0 && (
              <li className="calendar-upcoming-empty">
                Нет событий на ближайшую неделю
              </li>
            )}
            {upcoming.slice(0, 4).map(e => (
              <li key={e.id} className="calendar-upcoming-item">
                <span className="calendar-upcoming-icon">{EVENT_TYPES.find(t => t.value === e.type)?.icon}</span>
                <div className="calendar-upcoming-content">
                  <div className="calendar-upcoming-header">
                    <span className="calendar-upcoming-date" style={{ color: e.color }}>
                      {dayjs(e.date).format('DD.MM')}
                    </span>
                    <span className="calendar-upcoming-title-text">{e.title}</span>
                  </div>
                  {e.description && <span className="calendar-upcoming-comment">{e.description}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal
        title={isEditMode ? "Редактировать событие" : "Добавить событие"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Отмена
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
            style={{ background: '#C0FF4A', color: '#232946' }}
          >
            {isEditMode ? 'Сохранить' : 'Добавить'}
          </Button>,
          isEditMode && (
            <Button 
              key="delete" 
              danger 
              onClick={handleDeleteEvent}
              style={{ marginLeft: '8px' }}
            >
              Удалить
            </Button>
          )
        ].filter(Boolean)}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          style={{ marginTop: '16px' }}
        >
          <Form.Item label="Дата" name="date" rules={[{ required: true, message: 'Укажите дату' }]}>
            <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Тип события" name="type" rules={[{ required: true, message: 'Выберите тип события' }]}>
            <Select>
              {EVENT_TYPES.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  <span style={{ marginRight: '8px' }}>{type.icon}</span>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Название" name="title" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SupplyCalendar;
