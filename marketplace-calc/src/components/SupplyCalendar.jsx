import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Button, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { FaTruck, FaBoxOpen, FaCreditCard, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import './SupplyCalendar.css';

const EVENT_TYPES = [
  { value: 'order', label: 'Заказ товара', icon: <FaBoxOpen />, color: '#b490ff' },
  { value: 'warehouse', label: 'Доставлено на склад', icon: <FaTruck />, color: '#a6ff4d' },
  { value: 'arrival', label: 'Доставлено в город', icon: <FaTruck />, color: '#3b82f6' },
  { value: 'payment', label: 'Оплата', icon: <FaCreditCard />, color: '#ffadad' },
  { value: 'warning', label: 'Важно', icon: <FaExclamationTriangle />, color: '#ff7e67' },
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

  // Список событий на ближайшие дни
  const upcoming = events
    .filter(e => dayjs(e.date).isAfter(dayjs().subtract(1, 'day')) && dayjs(e.date).isBefore(dayjs().add(15, 'day')))
    .sort((a, b) => dayjs(a.date) - dayjs(b.date));

  // Функция для отображения событий в ячейках календаря
  const cellRender = (current, info) => {
    if (info.type !== 'date') return null;
    
    const dateStr = current.format('YYYY-MM-DD');
    const dateEvents = events.filter(event => event.date === dateStr);
    
    if (dateEvents.length === 0) return null;
    
    // Получаем тип первого события для этой даты
    const eventType = EVENT_TYPES.find(type => type.value === dateEvents[0].type) || EVENT_TYPES[0];
    
    // Добавляем точку для дней с событиями
    return (
      <div className="calendar-cell-dot" style={{ backgroundColor: eventType.color }} />
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
    <div className="supply-calendar">
      <div className="calendar-header">
        <h3 className="calendar-title">
          <FaCalendarAlt className="calendar-icon" />
          Календарь поставок
        </h3>
        <div className="calendar-controls">
          <button 
            className="calendar-nav-btn" 
            onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
          >
            ←
          </button>
          <span className="calendar-month">
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
      
      <div className="calendar-layout">
        <div className="calendar-grid">
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
        
        <div className="upcoming-events">
          <h4 className="upcoming-title">Ближайшие события:</h4>
          <div className="event-list">
            {upcoming.length === 0 && (
              <div className="no-events">
                Нет событий на ближайшие дни
              </div>
            )}
            {upcoming.slice(0, 4).map(e => {
              const eventType = EVENT_TYPES.find(t => t.value === e.type) || EVENT_TYPES[0];
              return (
                <div 
                  key={e.id} 
                  className="event-item"
                  onClick={() => handleEventClick(e)}
                >
                  <div className="event-date">{dayjs(e.date).format('DD.MM')}</div>
                  <div className="event-content">
                    <div className="event-icon" style={{ color: eventType.color }}>
                      {eventType.icon}
                    </div>
                    <div className="event-title">{e.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
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
