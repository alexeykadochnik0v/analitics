import React, { useRef, useEffect } from 'react';
import { Input, Button, Form, Checkbox, Space, Typography } from 'antd';
import { EditFilled, ReloadOutlined, CalculatorOutlined, ThunderboltFilled } from '@ant-design/icons';
import { simpleFields, advancedFields } from '../config/fields';
import { motion, AnimatePresence } from 'framer-motion';
import ModeToggle from './ModeToggle/ModeToggle';

const { Title } = Typography;

const TEMPLATES = {
  simple: {
    productName: 'Футболка',
    pricePurchaseUnit: 350,
    quantity: 100,
    deliveryTotal: 2500,
    packageTotal: 600,
    marketplaceServicesPerUnit: 120,
    priceSell: 990,
    taxRate: 6,
    goalProfit: 20000
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
          // Оставляем только нужные ключи для Dashboard
          const toSave = {
            netProfit: calcResult.netProfit ?? calcResult.grossProfit ?? 0,
            margin: calcResult.margin ?? 0,
            costPrice: calcResult.costPrice ?? 0,
            workingCapital: calcResult.workingCapital ?? 0,
            productName,
            date
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
    <motion.div 
      className="calc-card"
      style={{ width: '100%' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, justifyContent: 'center', width: '100%' }}>
        <CalculatorOutlined style={{ fontSize: 30, color: '#7c3aed' }} />
        <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: 1, color: '#23234c' }}>Калькулятор</Title>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <ModeToggle isAdvancedMode={isAdvancedMode} setIsAdvancedMode={setIsAdvancedMode} style={{ width: '100%' }} />
      </motion.div>
      <Form
        layout="vertical"
        form={form}
        onValuesChange={handleChange}
        autoComplete="off"
      >
        <AnimatePresence initial={false}>
          {fields.map((field, idx) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.28, delay: idx * 0.04 }}
            >
              <Form.Item
                name={field.name}
                label={field.label}
                rules={field.required ? [{ required: true, message: 'Обязательное поле' }] : []}
                valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
                validateTrigger={['onChange', 'onBlur']}
              >
                {field.type === 'checkbox' ? (
                  <Checkbox>{field.label}</Checkbox>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder || `Введите ${field.label.toLowerCase()}`}
                    suffix={field.suffix}
                    ref={idx === 0 ? firstErrorRef : undefined}
                    style={{ fontSize: 16, padding: '8px 12px', borderRadius: 8 }}
                  />
                )}
              </Form.Item>
            </motion.div>
          ))}
        </AnimatePresence>
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
      {isCalculated && results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginTop: 40 }}>
          <Title level={5} style={{ textAlign: 'center' }}>Результаты</Title>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', fontSize: 17 }}>
            <div><b>Чистая прибыль:</b> {results.profit}</div>
            <div><b>Маржа:</b> {results.margin}%</div>
            <div><b>Себестоимость:</b> {results.cost}</div>
            <div><b>Оборотка:</b> {results.turnover}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CalcCard;
