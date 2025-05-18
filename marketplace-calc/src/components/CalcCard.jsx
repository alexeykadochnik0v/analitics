import React, { useRef, useEffect } from 'react';
import { Input, Button, Form, Checkbox, Space, Typography } from 'antd';
import { EditFilled, ReloadOutlined, CalculatorOutlined, ThunderboltFilled } from '@ant-design/icons';
import { simpleFields, advancedFields } from '../config/fields';

import ModeToggle from './ModeToggle/ModeToggle';

const { Title } = Typography;

const TEMPLATES = {
  simple: {
    category: 'Дом и сад',
    priceSell: 600,
    weight: 0.216,
    length: 26,
    width: 7,
    height: 5,
    volume: 0.91,
    costPerUnit: 120,
    batchSize: 240,
    batchCost: 28795,
    otherCosts: 20,
    salesCount: 240,
    buyoutPercent: 95,
    taxRate: 6
  },
  advanced: {
    productName: 'Футболка',
    marketplace: 'WB',
    article: 'A12345',
    quantity: 100,
    pricePurchaseUnit: 350,
    deliveryToOurWarehouseTotal: 1200,
    packageTotal: 600,
    photoVideoDesignTotal: 3000,
    certificationTotal: 2000,
    deliveryToMPWarehouseTotal: 1300,
    fulfillmentUnit: 25,
    priceBeforeDiscount: 1090,
    discountPercent: 10,
    mpCommissionPercent: 10,
    logisticsToCustomerUnit: 60,
    buyoutPercent: 100,
    storagePerUnitPerDay: 0.5,
    promoPercent: 3,
    taxRate: 6,
    profitGoal: 20000,
    includeCertification: true,
    includePhotoVideoDesign: true
  }
};

import calculateProductMetrics from '../utils/calcProfit';

const CalcCard = ({
  isAdvancedMode,
  setIsAdvancedMode,
  formData,
  setFormData,
  setResults,
  setIsCalculated,
  isCalculated,
  results,
  isSaving,
  setIsSaving,
  saveSuccess,
  setSaveSuccess,
  saveError,
  setSaveError,
  form
}) => {
  const fields = isAdvancedMode ? [...simpleFields, ...advancedFields] : simpleFields;
  const firstErrorRef = useRef();

  // Автофокус на первом пустом поле
  useEffect(() => {
    setTimeout(() => {
      const firstEmpty = fields.find(f => f.required && !form.getFieldValue(f.name));
      if (firstEmpty) {
        const el = document.querySelector(`[name="${firstEmpty.name}"]`);
        if (el) el.focus();
      }
    }, 200);
    // eslint-disable-next-line
  }, [isAdvancedMode]);

  // Обработка изменения поля
  const handleChange = (changedValues, allValues) => {
    setFormData(allValues);
  };

  // Валидация: возвращает первое невалидное поле
  const getFirstInvalid = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]) return field.name;
    }
    return null;
  };

  // Рассчитать
  const handleCalculate = () => {
    form
      .validateFields()
      .then(() => {
        setIsCalculated(true);
        // Вызов реальной функции расчёта
        const calcResult = calculateProductMetrics(formData, isAdvancedMode);
        setResults(calcResult);
        // --- Сохраняем результат в localStorage только с нужными полями для Dashboard ---
        try {
          const prev = JSON.parse(localStorage.getItem('mpcalc_lastResults') || '[]');
          const now = new Date();
          const date = now.toLocaleDateString() + ' ' + now.toLocaleTimeString().slice(0,5);
          const productName = formData.productName || 'Без названия';
          // Сохраняем только нужные поля для истории
          const toSave = {
            productName,
            profit: calcResult.profit ?? 0,
            margin: calcResult.margin ?? 0,
            date: new Date().toISOString(),
            details: calcResult
          };
          const updated = [toSave, ...prev].slice(0, 20);
          localStorage.setItem('mpcalc_lastResults', JSON.stringify(updated));
        } catch (e) { /* ignore */ }
      })
      .catch(() => {
        // Фокус на первом невалидном
        const first = getFirstInvalid();
        if (first && firstErrorRef.current) {
          firstErrorRef.current.focus();
        }
      });
  };

  // Заполнить шаблон
  const handleTemplate = () => {
    const template = isAdvancedMode ? TEMPLATES.advanced : TEMPLATES.simple;
    // Автоприведение типов для числовых полей
    const numberFields = [
      'pricePurchaseUnit','quantity','deliveryTotal','packageTotal','marketplaceServicesPerUnit','priceSell','taxRate','goalProfit',
      'deliveryToOurWarehouseTotal','photoVideoDesignTotal','certificationTotal','deliveryToMPWarehouseTotal','fulfillmentUnit','priceBeforeDiscount','discountPercent','mpCommissionPercent','logisticsToCustomerUnit','buyoutPercent','storagePerUnitPerDay','promoPercent','profitGoal'
    ];
    const normalized = { ...template };
    numberFields.forEach(key => {
      if (normalized[key] !== undefined) {
        normalized[key] = typeof normalized[key] === 'number' ? normalized[key] : Number(normalized[key]);
      }
    });
    form.setFieldsValue(normalized);
    setFormData(normalized);
    setIsCalculated(false);
    setResults(null);
  };

  // Сбросить
  const handleReset = () => {
    form.resetFields();
    setFormData({});
    setIsCalculated(false);
    setResults(null);
  };

  return (
    <div className="calc-card" style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, justifyContent: 'center', width: '100%' }}>
        <CalculatorOutlined style={{ fontSize: 30, color: '#7c3aed' }} />
        <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: 1, color: '#23234c' }}>Калькулятор</Title>
      </div>

        <ModeToggle isAdvancedMode={isAdvancedMode} setIsAdvancedMode={setIsAdvancedMode} style={{ width: '100%' }} />
      <Form
        layout="vertical"
        form={form}
        onValuesChange={handleChange}
        autoComplete="off"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
  {/* Категория, цена, вес */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
    <Form.Item
      name="category"
      label="Категория"
      rules={[{ required: true, message: 'Обязательное поле' }]}
    >
      <Input type="text" placeholder="Выберите категорию" style={{ fontSize: 16, padding: '8px 12px', borderRadius: 8 }} />
    </Form.Item>
    <Form.Item
      name="priceSell"
      label="Цена товара"
      rules={[{ required: true, message: 'Обязательное поле' }]}
    >
      <Input type="number" placeholder="Например, 4200" suffix="₽" style={{ fontSize: 16, padding: '8px 12px', borderRadius: 8 }} />
    </Form.Item>
    <Form.Item
      name="weight"
      label="Вес, кг"
      rules={[{ required: true, message: 'Обязательное поле' }]}
    >
      <Input type="number" placeholder="0.51" suffix="кг" step="0.001" style={{ fontSize: 16, padding: '8px 12px', borderRadius: 8 }} />
    </Form.Item>
  </div>
  {/* Габариты */}
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
    <Form.Item name="length" label="Длина, см" rules={[{ required: true, message: 'Обязательное поле' }]}> <Input type="number" placeholder="34" suffix="см" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
    <Form.Item name="width" label="Ширина, см" rules={[{ required: true, message: 'Обязательное поле' }]}> <Input type="number" placeholder="15" suffix="см" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
    <Form.Item name="height" label="Высота, см" rules={[{ required: true, message: 'Обязательное поле' }]}> <Input type="number" placeholder="6" suffix="см" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
    <Form.Item name="volume" label="Объём, л"> <Input type="number" placeholder="3.06" suffix="л" disabled style={{ fontSize: 16, borderRadius: 8, background: '#f6f6fa' }} /> </Form.Item>
  </div>
  {/* Блок Себестоимость партии */}
  <div style={{ margin: '18px 0 0 0', padding: '14px 10px', background: '#f7f7fc', borderRadius: 12, border: '1px solid #ececec' }}>
    <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 16, color: '#23234c' }}>Себестоимость партии</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      <Form.Item name="costPerUnit" label="Себестоимость товара, ₽ за шт" rules={[{ required: true, message: 'Обязательное поле' }]}> <Input type="number" placeholder="1400" suffix="₽" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
      <Form.Item name="batchSize" label="Кол-во товаров в партии, шт" rules={[{ required: true, message: 'Обязательное поле' }]}> <Input type="number" placeholder="100" suffix="шт" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
      <Form.Item name="batchCost" label="Стоимость закупки партии, ₽" rules={[{ required: true, message: 'Обязательное поле' }]}> <Input type="number" placeholder="140000" suffix="₽" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
    </div>
  </div>
  {/* Прочие расходы и продажи */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
    <Form.Item name="otherCosts" label="Прочие затраты, ₽ на шт"> <Input type="number" placeholder="100" suffix="₽" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
    <Form.Item name="salesCount" label="Количество продаж в месяц, шт"> <Input type="number" placeholder="30" suffix="шт" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
    <Form.Item name="buyoutPercent" label="Выкуп, %"> <Input type="number" placeholder="95" suffix="%" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
    <Form.Item name="taxRate" label="Налог на прибыль, %"> <Input type="number" placeholder="6" suffix="%" style={{ fontSize: 16, borderRadius: 8 }} /> </Form.Item>
  </div>
</div>
        <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16, width: '100%' }} direction="vertical">
          <Button
            onClick={handleCalculate}
            style={{
              width: '100%',
              background: '#7c3aed',
              color: '#fff',
              fontWeight: 700,
              fontSize: 20,
              borderRadius: 12,
              padding: '16px 0',
              boxShadow: '0 4px 24px 0 rgba(124,58,237,0.11)',
              border: 'none',
              marginBottom: 8
            }}
            size="large"
          >
            <span style={{ fontSize: 24, opacity: 0.95, marginRight: 8 }}><CalculatorOutlined /></span>
            {isSaving ? 'Рассчитываем...' : 'Рассчитать'}
          </Button>
          <Button icon={<ReloadOutlined />} size="large" onClick={handleReset} disabled={isSaving} block>
            Сбросить
          </Button>
          <Button icon={<ThunderboltFilled />} size="large" onClick={handleTemplate} disabled={isSaving} style={{ background: '#f7f0ff', color: '#7c3aed', border: 'none' }} block>
            Заполнить шаблон
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default CalcCard;
