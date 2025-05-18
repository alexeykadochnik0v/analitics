import React, { useState, useEffect } from 'react';
import { Form } from 'antd';

import DashboardMetrics from '../../components/DashboardMetrics';
import CalcCard from '../../components/CalcCard';
import HistoryBlock from '../../components/HistoryBlock.jsx';
import TipsBlock from '../../components/TipsBlock.jsx';

import './CalculatorPage.css'; // DetailsBlock и DashboardLayout удалены

const initialSimple = {
  pricePurchaseUnit: 0,
  quantity: 0,
  deliveryTotal: 0,
  packageTotal: 0,
  marketplaceServicesPerUnit: 0,
  priceSell: 0,
  taxRate: 6,
  goalProfit: 0,
  productName: ''
};

const initialAdvanced = {
  productName: '',
  marketplace: '',
  article: '',
  quantity: 0,
  pricePurchaseUnit: 0,
  deliveryToOurWarehouseTotal: 0,
  packageTotal: 0,
  photoVideoDesignTotal: 0,
  certificationTotal: 0,
  deliveryToMPWarehouseTotal: 0,
  fulfillmentUnit: 0,
  priceBeforeDiscount: 0,
  discountPercent: 0,
  mpCommissionPercent: 0,
  logisticsToCustomerUnit: 0,
  buyoutPercent: 100,
  storagePerUnitPerDay: 0,
  promoPercent: 0,
  taxRate: 6,
  profitGoal: 0,
  includeCertification: true,
  includePhotoVideoDesign: true
};

// import { useLocation } from 'react-router-dom';
import { Row, Col, Card } from 'antd';

const CalculatorPage = ({ user }) => {
  const [form] = Form.useForm();
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [formData, setFormData] = useState(initialSimple);
  const [results, setResults] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mpcalc_lastResults') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const update = () => {
      try {
        setHistory(JSON.parse(localStorage.getItem('mpcalc_lastResults') || '[]'));
      } catch {
        setHistory([]);
      }
    };
    window.addEventListener('storage', update);
    window.addEventListener('focus', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('focus', update);
    };
  }, []);

  return (
    <div className="calculator-page">
      <div className="calculator-main-grid">
        <div className="calculator-col-left">
          <div className="calculator-card">
            <CalcCard
              form={form}
              isAdvancedMode={isAdvancedMode}
              setIsAdvancedMode={setIsAdvancedMode}
              formData={formData}
              setFormData={setFormData}
              setResults={setResults}
              setIsCalculated={setIsCalculated}
              isCalculated={isCalculated}
              results={results}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              saveSuccess={saveSuccess}
              setSaveSuccess={setSaveSuccess}
              saveError={saveError}
              setSaveError={setSaveError}
            />
          </div>
        </div>
        <div className="calculator-col-right">
          {results && <DashboardMetrics results={results} />}
          <div className="history-card">
            <HistoryBlock history={history} />
          </div>
          <TipsBlock />
        </div>
      </div>
    </div>
  );

  // Загрузка данных из истории, если они переданы
  useEffect(() => {
    if (location.state?.calculationData) {
      const { input, productName, ...calculationResults } = location.state.calculationData;
      
      // Установка входных данных из истории
      if (input) {
        setFormData({
          ...input,
          productName: productName || ''
        });
      }
      
      // Установка результатов
      setResults(calculationResults);
      setIsCalculated(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModeToggle = () => {
    setIsAdvancedMode((prev) => {
      const next = !prev;
      setFormData(next ? initialAdvanced : initialSimple);
      return next;
    });
    setResults(null);
    setIsCalculated(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(null);
    // Преобразуем значения в числа, кроме строковых
    const calculationData = {};
    Object.keys(formData).forEach(key => {
      if (["productName","marketplace","article"].includes(key)) {
        calculationData[key] = formData[key];
      } else if (typeof formData[key] === 'boolean') {
        calculationData[key] = formData[key];
      } else {
        calculationData[key] = formData[key] === '' ? 0 : parseFloat(formData[key]);
      }
    });
    const calculationResults = calculateProductMetrics(calculationData, isAdvancedMode);
    setResults(calculationResults);
    setIsCalculated(true);

    // --- Добавление расчёта в историю ---
    const historyItem = {
      productName: formData.productName || 'Без названия',
      profit: isAdvancedMode
        ? (calculationResults.netProfitUnit ?? calculationResults.netProfitTotal ?? calculationResults.profit ?? 0)
        : (calculationResults.profit ?? 0),
      margin: isAdvancedMode
        ? (calculationResults.marginPercent ?? calculationResults.margin ?? 0)
        : (calculationResults.margin ?? 0),
      date: new Date().toISOString(),
      // Для модального окна — всё остальное в calculationResults (можно передавать item целиком при клике)
      details: calculationResults
    };
    let lastResults = [];
    try {
      lastResults = JSON.parse(localStorage.getItem('mpcalc_lastResults') || '[]');
    } catch {}
    lastResults.unshift(historyItem);
    localStorage.setItem('mpcalc_lastResults', JSON.stringify(lastResults.slice(0, 30)));
    setHistory(lastResults.slice(0, 30));
    // --- Конец добавления ---
  };
  
  const handleSaveCalculation = async () => {
    if (!user) {
      setSaveError('Для сохранения расчета необходимо авторизоваться');
      return;
    }
    
    if (!results) {
      setSaveError('Нет данных для сохранения. Сначала выполните расчет.');
      return;
    }
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Подготовка данных для сохранения
      const calculationToSave = {
        ...results,
        productName: formData.productName || 'Товар без названия'
      };
      
      // Сохранение в Firestore
      await saveCalculation(calculationToSave, user.uid, formData.productName);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Скрыть сообщение через 3 секунды
    } catch (error) {
      console.error('Error saving calculation:', error);
      setSaveError('Ошибка при сохранении расчета. Попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <GreetingBlock />
      <DashboardMetrics />
      <CalcCard>
        <div className="calculator-page">
          <h1>Калькулятор маржи и прибыли</h1>
          <p className="description">
            Рассчитайте прибыльность вашего товара на маркетплейсах
          </p>
          <ModeToggle isAdvancedMode={isAdvancedMode} onChange={handleModeToggle} />
          <div className="calculator-container">
            <form onSubmit={handleSubmit} className="calculator-form">
              {isAdvancedMode ? (
                <div className="form-layout advanced">
                  {/* --- Информация о товаре --- */}
                  <div className="form-section product-info">
                    <h2>Информация о товаре</h2>
                    <InputField label="Название товара на WB" name="productName" value={formData.productName} onChange={handleChange} type="text" required={false} />
                    <InputField label="Маркетплейс" name="marketplace" value={formData.marketplace} onChange={handleChange} type="text" required={false} />
                    <InputField label="Артикул товара" name="article" value={formData.article} onChange={handleChange} type="text" required={false} />
                    <InputField label="Кол-во" name="quantity" value={formData.quantity} onChange={handleChange} required step="1" suffix="шт." />
                  </div>
                  {/* --- Логистика --- */}
                  <div className="form-section logistics">
                    <h2>Логистика</h2>
                    <InputField label="Цена закупки за ед." name="pricePurchaseUnit" value={formData.pricePurchaseUnit} onChange={handleChange} suffix="₽" />
                    <InputField label="Цена закупки партии (авто)" name="pricePurchaseTotal" value={results?.pricePurchaseTotal ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Доставка до нашего склада (партия)" name="deliveryToOurWarehouseTotal" value={formData.deliveryToOurWarehouseTotal} onChange={handleChange} suffix="₽" />
                    <InputField label="Доставка до нашего склада на 1 ед (авто)" name="deliveryToOurWarehouseUnit" value={results?.deliveryToOurWarehouseUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Упаковка общая" name="packageTotal" value={formData.packageTotal} onChange={handleChange} suffix="₽" />
                    <InputField label="Упаковка на 1 ед (авто)" name="packageUnit" value={results?.packageUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Доставка до склада МП (партия)" name="deliveryToMPWarehouseTotal" value={formData.deliveryToMPWarehouseTotal} onChange={handleChange} suffix="₽" />
                    <InputField label="Доставка до склада МП на 1 ед (авто)" name="deliveryToMPWarehouseUnit" value={results?.deliveryToMPWarehouseUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Фулфилмент на 1 ед" name="fulfillmentUnit" value={formData.fulfillmentUnit} onChange={handleChange} suffix="₽" />
                  </div>
                  {/* --- Услуги и комиссии --- */}
                  <div className="form-section services">
                    <h2>Услуги и комиссии</h2>
                    <CheckboxField label="Учитывать Фото/Видео/Дизайнер" name="includePhotoVideoDesign" checked={formData.includePhotoVideoDesign} onChange={handleChange} />
                    <InputField label="Услуги Фото/Видео/Дизайнер общая" name="photoVideoDesignTotal" value={formData.photoVideoDesignTotal} onChange={handleChange} suffix="₽" />
                    <InputField label="Услуги Фото/Видео/Дизайнер на 1 ед (авто)" name="photoVideoDesignUnit" value={results?.photoVideoDesignUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <CheckboxField label="Учитывать сертификацию" name="includeCertification" checked={formData.includeCertification} onChange={handleChange} />
                    <InputField label="Сертификация общая" name="certificationTotal" value={formData.certificationTotal} onChange={handleChange} suffix="₽" />
                    <InputField label="Сертификация на 1 ед (авто)" name="certificationUnit" value={results?.certificationUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Комиссия МП (%)" name="mpCommissionPercent" value={formData.mpCommissionPercent} onChange={handleChange} suffix="%" />
                    <InputField label="Комиссия МП на 1 ед (авто)" name="mpCommissionUnit" value={results?.mpCommissionUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Логистика к покупателю на 1 ед" name="logisticsToCustomerUnit" value={formData.logisticsToCustomerUnit} onChange={handleChange} suffix="₽" />
                    <InputField label="% Выкупа по Категории" name="buyoutPercent" value={formData.buyoutPercent} onChange={handleChange} suffix="%" />
                    <InputField label="Доставка с %выкупа (авто)" name="buyoutDeliveryUnit" value={results?.buyoutDeliveryUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Хранение на складе 1 ед/сутки" name="storagePerUnitPerDay" value={formData.storagePerUnitPerDay} onChange={handleChange} suffix="₽" />
                    <InputField label="Хранение 1 ед. за 30 дней (авто)" name="storageUnit30Days" value={results?.storageUnit30Days ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Доля затрат на продвижение (%)" name="promoPercent" value={formData.promoPercent} onChange={handleChange} suffix="%" />
                    <InputField label="Затраты на продвижение 1 ед (авто)" name="promoUnit" value={results?.promoUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Все услуги МП (авто)" name="mpServicesUnit" value={results?.mpServicesUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                  </div>
                  {/* --- Цены и скидки --- */}
                  <div className="form-section prices">
                    <h2>Цены и скидки</h2>
                    <InputField label="Цена до скидки" name="priceBeforeDiscount" value={formData.priceBeforeDiscount} onChange={handleChange} suffix="₽" />
                    <InputField label="Скидка (%)" name="discountPercent" value={formData.discountPercent} onChange={handleChange} suffix="%" />
                    <InputField label="Цена со скидкой (авто)" name="priceAfterDiscount" value={results?.priceAfterDiscount ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                  </div>
                  {/* --- Прочие расходы и цели --- */}
                  <div className="form-section goals">
                    <h2>Цели и аналитика</h2>
                    <InputField label="Себестоимость 1 ед ИТОГО (авто)" name="costUnitTotal" value={results?.costUnitTotal ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Себестоимость партии ИТОГО (авто)" name="costTotal" value={results?.costTotal ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Валовая прибыль на 1 ед (авто)" name="grossProfitUnit" value={results?.grossProfitUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Валовая прибыль с партии (авто)" name="grossProfitTotal" value={results?.grossProfitTotal ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="НАЛОГ УСН ₽ (авто)" name="usnTaxUnit" value={results?.usnTaxUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Чистая прибыль на 1 ед (авто)" name="netProfitUnit" value={results?.netProfitUnit ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Чистая прибыль с партии (авто)" name="netProfitTotal" value={results?.netProfitTotal ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Маржинальность (%) (авто)" name="marginPercent" value={results?.marginPercent ?? ''} onChange={handleChange} suffix="%" disabled gray />
                    <InputField label="ЦЕЛЬ по прибыли" name="profitGoal" value={formData.profitGoal} onChange={handleChange} suffix="₽" />
                    <InputField label="Нужно продать (авто)" name="unitsToGoal" value={results?.unitsToGoal ?? ''} onChange={handleChange} disabled gray />
                    <InputField label="Оборотные средства (авто)" name="workingCapital" value={results?.workingCapital ?? ''} onChange={handleChange} suffix="₽" disabled gray />
                    <InputField label="Ставка налога УСН" name="taxRate" value={formData.taxRate} onChange={handleChange} suffix="%" />
                  </div>
                </div>
              ) : (
              <div className="form-layout">
                <div className="form-column">
                  <div className="form-section product-info">
                    <h2>Информация о товаре</h2>
                    <div className="form-row">
                      <InputField
                        label="Цена закупки за 1 ед."
                        name="pricePurchaseUnit"
                        value={formData.pricePurchaseUnit}
                        onChange={handleChange}
                        required
                        suffix="₽"
                      />
                      <div className="arrow-icon">→</div>
                      <InputField
                        label="Цена продажи"
                        name="priceSell"
                        value={formData.priceSell}
                        onChange={handleChange}
                        required
                        suffix="₽"
                      />
                    </div>
                    <div className="form-row">
                      <InputField
                        label="Количество"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        step="1"
                        suffix="шт."
                      />
                    </div>
                  </div>
                  <div className="form-section expenses">
                    <h2>Расходы</h2>
                    <div className="expenses-container">
                      <div className="expense-group">
                        <h3>Логистика и упаковка</h3>
                        <div className="form-row">
                          <InputField
                            label="Доставка до склада (вся партия)"
                            name="deliveryTotal"
                            value={formData.deliveryTotal}
                            onChange={handleChange}
                            suffix="₽"
                          />
                        </div>
                        <div className="form-row">
                          <InputField
                            label="Упаковка (вся партия)"
                            name="packageTotal"
                            value={formData.packageTotal}
                            onChange={handleChange}
                            suffix="₽"
                          />
                        </div>
                      </div>
                      <div className="expense-group">
                        <h3>Комиссии и налоги</h3>
                        <div className="form-row">
                          <InputField
                            label="Все услуги МП на 1 ед."
                            name="marketplaceServicesPerUnit"
                            value={formData.marketplaceServicesPerUnit}
                            onChange={handleChange}
                            suffix="₽"
                          />
                        </div>
                        <div className="form-row">
                          <InputField
                            label="Ставка налога УСН"
                            name="taxRate"
                            value={formData.taxRate}
                            onChange={handleChange}
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-section goals">
                    <h2>Цели</h2>
                    <div className="form-row">
                      <InputField
                        label="Цель по прибыли (опционально)"
                        name="goalProfit"
                        value={formData.goalProfit}
                        onChange={handleChange}
                        required={false}
                        suffix="₽"
                      />
                    </div>
                    <div className="goals-info">
                      <p>Укажите сумму, которую хотите заработать. Калькулятор рассчитает, сколько единиц товара нужно продать для достижения этой цели.</p>
                    </div>
                  </div>
                  <div className="calculation-hints">
                    <div className="hint">
                      <div className="hint-icon">💡</div>
                      <div className="hint-text">
                        <h3>Совет</h3>
                        <p>Не забудьте учесть все расходы на маркетплейсе, включая комиссии за продажу, хранение и доставку до покупателя.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
              <div className="form-actions">
                <button type="submit" className="calculate-button">
                  Рассчитать
                </button>
              </div>
            </form>
            {isCalculated && (
              <>
                <ResultBlock results={results} />
                {user && (
                  <div className="save-calculation">
                    <div className="product-name-input">
                      <InputField
                        label="Название товара (для сохранения)"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        type="text"
                        required={false}
                      />
                    </div>
                    <button 
                      type="button" 
                      className="save-button"
                      onClick={handleSaveCalculation}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Сохранение...' : 'Сохранить расчет'}
                    </button>
                    {saveSuccess && (
                      <div className="save-success">
                        Расчет успешно сохранен!
                      </div>
                    )}
                    {saveError && (
                      <div className="save-error">
                        {saveError}
                      </div>
                    )}
                  </div>
                )}
                {!user && (
                  <div className="auth-prompt">
                    <p>Войдите в систему, чтобы сохранять расчеты и просматривать историю.</p>
                  </div>
                )}
              </>
            )}
          </div>
      </div>
    </CalcCard>
    {/* Placeholder для графика/календаря */}
    <div style={{ background: '#f3f0ff', borderRadius: 18, minHeight: 180, margin: '0 auto', maxWidth: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 22, fontWeight: 600 }}>
      📈 Здесь скоро появится график и календарь!
    </div>
    </>
  );
};

export default CalculatorPage;
