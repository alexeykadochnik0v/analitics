/**
 * Функция для расчета прибыли и маржинальности товара на маркетплейсах
 * @param {Object} data - Объект с входными данными
 * @param {boolean} isAdvancedMode - Флаг расширенного режима
 * @returns {Object} - Объект с результатами расчетов
 */
export function calculateProductMetrics(data, isAdvancedMode = false) {
  // Извлекаем данные в зависимости от режима
  if (isAdvancedMode) {
    return calculateAdvancedMetrics(data);
  } else {
    return calculateSimpleMetrics(data);
  }
}

/**
 * Функция для расчета в простом режиме
 * @param {Object} data - Объект с входными данными
 * @returns {Object} - Объект с результатами расчетов
 */
function calculateSimpleMetrics(data) {
  // Обязательные входные данные
  const {
    pricePurchaseUnit = 0,     // Цена закупки за 1 ед.
    quantity = 1,              // Кол-во
    deliveryTotal = 0,         // Доставка до склада (вся партия)
    packageTotal = 0,          // Упаковка (вся партия)
    marketplaceServicesPerUnit = 0, // Все услуги МП на 1 ед.
    priceSell = 0,             // Цена продажи
    taxRate = 6,               // Ставка налога УСН (по умолчанию 6%)
    goalProfit = 0             // Цель по прибыли (опц.)
  } = data;

  // 1. Доставка на 1 ед.
  const deliveryPerUnit = deliveryTotal / quantity;
  
  // 2. Упаковка на 1 ед.
  const packagePerUnit = packageTotal / quantity;
  
  // 3. Себестоимость (сумма всех затрат)
  const costPrice = pricePurchaseUnit + deliveryPerUnit + packagePerUnit + marketplaceServicesPerUnit;
  
  // 4. Валовая прибыль на 1 ед.
  const grossProfit = priceSell - costPrice;
  
  // 5. Налог УСН
  const taxAmount = grossProfit * (taxRate / 100);
  
  // 6. Чистая прибыль на 1 ед.
  const netProfit = grossProfit - taxAmount;
  
  // 7. Маржинальность
  const margin = (netProfit / priceSell) * 100;
  
  // 8. Оборотные средства
  const workingCapital = costPrice * quantity;
  
  // 9. Нужно продать для цели
  const targetUnits = goalProfit > 0 ? Math.ceil(goalProfit / netProfit) : 0;

  return {
    // Расчеты по единице товара
    deliveryPerUnit: roundToTwo(deliveryPerUnit),      // Доставка на 1 ед.
    packagePerUnit: roundToTwo(packagePerUnit),        // Упаковка на 1 ед.
    costPrice: roundToTwo(costPrice),                  // Себестоимость
    grossProfit: roundToTwo(grossProfit),              // Валовая прибыль на 1 ед.
    taxAmount: roundToTwo(taxAmount),                  // Налог УСН
    netProfit: roundToTwo(netProfit),                  // Чистая прибыль на 1 ед.
    
    // Общие показатели
    margin: roundToTwo(margin),                        // Маржинальность (%)
    workingCapital: roundToTwo(workingCapital),        // Оборотные средства
    targetUnits: targetUnits,                          // Нужно продать для цели
    
    // Исходные данные (для удобства)
    input: {
      pricePurchaseUnit,
      quantity,
      deliveryTotal,
      packageTotal,
      marketplaceServicesPerUnit,
      priceSell,
      taxRate,
      goalProfit
    }
  };
}

/**
 * Функция для расчета в расширенном режиме
 * @param {Object} data - Объект с входными данными
 * @returns {Object} - Объект с результатами расчетов
 */
function calculateAdvancedMetrics(data) {
  // Извлекаем все поля из расширенного режима
  const {
    // Информация о товаре
    productName = '',              // Название товара на WB
    marketplace = '',              // Маркетплейс
    article = '',                  // Артикул товара
    quantity = 1,                  // Кол-во в штуках
    
    // Цены и закупка
    pricePurchaseUnit = 0,         // Цена закупки за ед.
    pricePurchaseTotal = 0,        // Цена закупки партии (авто)
    
    // Доставка до нашего склада
    deliveryToOurWarehouseTotal = 0, // Доставка до нашего склада (партия)
    deliveryToOurWarehouseUnit = 0,  // Доставка до нашего склада на 1 ед (авто)
    
    // Упаковка
    packageTotal = 0,              // Упаковка общая
    packageUnit = 0,               // Упаковка на 1 ед (авто)
    
    // Услуги Фото/Видео/Дизайнер
    photoVideoDesignTotal = 0,     // Услуги Фото/Видео/Дизайнер общая
    photoVideoDesignUnit = 0,      // Услуги Фото/Видео/Дизайнер на 1 ед (авто)
    includePhotoVideoDesign = true, // Флаг учета услуг Фото/Видео/Дизайнер
    
    // Сертификация
    certificationTotal = 0,        // Сертификация общая
    certificationUnit = 0,         // Сертификация на 1 ед (авто)
    includeCertification = true,   // Флаг учета сертификации
    
    // Доставка до склада МП
    deliveryToMPWarehouseTotal = 0, // Доставка до склада МП (партия)
    deliveryToMPWarehouseUnit = 0,  // Доставка до склада МП на 1 ед (авто)
    
    // Фулфилмент
    fulfillmentUnit = 0,           // Фулфилмент на 1 ед
    
    // Цены продажи
    priceBeforeDiscount = 0,       // Цена до скидки
    discountPercent = 0,           // Скидка (%)
    priceAfterDiscount = 0,        // Цена со скидкой (авто)
    
    // Комиссии и услуги МП
    mpCommissionPercent = 0,       // Комиссия МП (%)
    mpCommissionUnit = 0,          // Комиссия МП на 1 ед (авто)
    logisticsToCustomerUnit = 0,   // Логистика к покупателю на 1 ед
    buyoutPercent = 100,           // % Выкупа по Категории
    buyoutDeliveryUnit = 0,        // Доставка с %выкупа (авто)
    
    // Хранение
    storagePerUnitPerDay = 0,      // Хранение на складе 1 ед/сутки
    storageUnit30Days = 0,         // Хранение 1 ед. за 30 дней (авто)
    
    // Продвижение
    promoPercent = 0,              // Доля затрат на продвижение (%)
    promoUnit = 0,                 // Затраты на продвижение 1 ед (авто)
    
    // Налоги
    taxRate = 6,                   // Ставка налога УСН (по умолчанию 6%)
    
    // Цели
    profitGoal = 0                 // ЦЕЛЬ по прибыли
  } = data;

  // Рассчитываем автоматические поля
  const calculatedPricePurchaseTotal = pricePurchaseUnit * quantity;
  const calculatedDeliveryToOurWarehouseUnit = quantity > 0 ? deliveryToOurWarehouseTotal / quantity : 0;
  const calculatedPackageUnit = quantity > 0 ? packageTotal / quantity : 0;
  const calculatedPhotoVideoDesignUnit = includePhotoVideoDesign && quantity > 0 ? photoVideoDesignTotal / quantity : 0;
  const calculatedCertificationUnit = includeCertification && quantity > 0 ? certificationTotal / quantity : 0;
  const calculatedDeliveryToMPWarehouseUnit = quantity > 0 ? deliveryToMPWarehouseTotal / quantity : 0;
  
  const calculatedPriceAfterDiscount = priceBeforeDiscount * (1 - discountPercent / 100);
  const calculatedMpCommissionUnit = calculatedPriceAfterDiscount * mpCommissionPercent / 100;
  const calculatedBuyoutDeliveryUnit = logisticsToCustomerUnit * buyoutPercent / 100;
  const calculatedStorageUnit30Days = storagePerUnitPerDay * 30;
  const calculatedPromoUnit = calculatedPriceAfterDiscount * promoPercent / 100;
  
  // Себестоимость 1 ед. ИТОГО
  const costUnitTotal = 
    pricePurchaseUnit +
    calculatedDeliveryToOurWarehouseUnit +
    calculatedPackageUnit +
    (includePhotoVideoDesign ? calculatedPhotoVideoDesignUnit : 0) +
    (includeCertification ? calculatedCertificationUnit : 0) +
    calculatedDeliveryToMPWarehouseUnit +
    fulfillmentUnit;
  
  // Себестоимость партии ИТОГО
  const costTotal = costUnitTotal * quantity;
  
  // Все услуги МП
  const mpServicesUnit =
    calculatedMpCommissionUnit +
    logisticsToCustomerUnit +
    calculatedBuyoutDeliveryUnit +
    calculatedStorageUnit30Days +
    calculatedPromoUnit +
    fulfillmentUnit;
  
  // Валовая прибыль на 1 ед.
  const grossProfitUnit = calculatedPriceAfterDiscount - costUnitTotal;
  
  // Валовая прибыль с партии
  const grossProfitTotal = grossProfitUnit * quantity;
  
  // НАЛОГ УСН ₽
  const usnTaxUnit = grossProfitUnit * (taxRate / 100);
  
  // Чистая прибыль на 1 ед.
  const netProfitUnit = grossProfitUnit - usnTaxUnit;
  
  // Чистая прибыль с партии
  const netProfitTotal = netProfitUnit * quantity;
  
  // Маржинальность (%)
  const marginPercent = calculatedPriceAfterDiscount > 0 ? (netProfitUnit / calculatedPriceAfterDiscount * 100) : 0;
  
  // Нужно продать
  const unitsToGoal = netProfitUnit > 0 ? Math.ceil(profitGoal / netProfitUnit) : 0;
  
  // Оборотные средства
  const workingCapital = costUnitTotal * quantity;

  return {
    // Автоматически рассчитанные поля
    pricePurchaseTotal: roundToTwo(calculatedPricePurchaseTotal),
    deliveryToOurWarehouseUnit: roundToTwo(calculatedDeliveryToOurWarehouseUnit),
    packageUnit: roundToTwo(calculatedPackageUnit),
    photoVideoDesignUnit: roundToTwo(calculatedPhotoVideoDesignUnit),
    certificationUnit: roundToTwo(calculatedCertificationUnit),
    deliveryToMPWarehouseUnit: roundToTwo(calculatedDeliveryToMPWarehouseUnit),
    priceAfterDiscount: roundToTwo(calculatedPriceAfterDiscount),
    mpCommissionUnit: roundToTwo(calculatedMpCommissionUnit),
    buyoutDeliveryUnit: roundToTwo(calculatedBuyoutDeliveryUnit),
    storageUnit30Days: roundToTwo(calculatedStorageUnit30Days),
    promoUnit: roundToTwo(calculatedPromoUnit),
    
    // Итоговые расчеты
    costUnitTotal: roundToTwo(costUnitTotal),
    costTotal: roundToTwo(costTotal),
    mpServicesUnit: roundToTwo(mpServicesUnit),
    grossProfitUnit: roundToTwo(grossProfitUnit),
    grossProfitTotal: roundToTwo(grossProfitTotal),
    usnTaxUnit: roundToTwo(usnTaxUnit),
    netProfitUnit: roundToTwo(netProfitUnit),
    netProfitTotal: roundToTwo(netProfitTotal),
    marginPercent: roundToTwo(marginPercent),
    unitsToGoal: unitsToGoal,
    workingCapital: roundToTwo(workingCapital),
    
    // Исходные данные (для удобства)
    input: data
  };
}

// Вспомогательная функция для округления до 2 знаков
function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Экспортируем функцию по умолчанию
export default calculateProductMetrics;
