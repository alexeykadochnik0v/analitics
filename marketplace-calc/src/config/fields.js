// Конфиги полей для простого и расширенного режима калькулятора

export const simpleFields = [
  // Основные параметры
  { name: 'category', label: 'Категория', required: true, type: 'select', options: [
    { label: 'Гигиена и уход для животных', value: 'pet-care' },
    { label: 'Дом и сад', value: 'home-garden' },
    { label: 'Одежда', value: 'clothes' },
    { label: 'Электроника', value: 'electronics' },
    { label: 'Другое', value: 'other' }
  ], placeholder: 'Выберите категорию' },
  { name: 'priceSell', label: 'Цена товара', required: true, type: 'number', suffix: '₽', placeholder: 'Например, 4200' },
  { name: 'weight', label: 'Вес, кг', required: true, type: 'number', step: 0.001, suffix: 'кг', placeholder: '0.51' },
  // Габариты
  { name: 'length', label: 'Длина, см', required: true, type: 'number', suffix: 'см', placeholder: '34' },
  { name: 'width', label: 'Ширина, см', required: true, type: 'number', suffix: 'см', placeholder: '15' },
  { name: 'height', label: 'Высота, см', required: true, type: 'number', suffix: 'см', placeholder: '6' },
  { name: 'volume', label: 'Объём, л', required: false, type: 'number', suffix: 'л', placeholder: '3.06', disabled: true },

  // Блок "Себестоимость партии"
  { name: 'costPerUnit', label: 'Себестоимость товара, ₽ за шт', required: true, type: 'number', suffix: '₽', placeholder: '1400' },
  { name: 'batchSize', label: 'Кол-во товаров в партии, шт', required: true, type: 'number', suffix: 'шт', placeholder: '100' },
  { name: 'batchCost', label: 'Стоимость закупки партии, ₽', required: true, type: 'number', suffix: '₽', placeholder: '140000' },

  // Прочие расходы
  { name: 'otherCosts', label: 'Прочие затраты, ₽ на шт', required: false, type: 'number', suffix: '₽', placeholder: '100' },
  { name: 'salesCount', label: 'Количество продаж в месяц, шт', required: false, type: 'number', suffix: 'шт', placeholder: '30' },
  { name: 'buyoutPercent', label: 'Выкуп, %', required: false, type: 'number', suffix: '%', placeholder: '95' },
  { name: 'taxRate', label: 'Налог на прибыль, %', required: false, type: 'number', suffix: '%', placeholder: '6' }
];

export const advancedFields = [
  { name: 'marketplace', label: 'Маркетплейс', required: false, type: 'text', placeholder: 'WB/OZON/Яндекс' },
  { name: 'article', label: 'Артикул', required: false, type: 'text' },
  { name: 'deliveryToOurWarehouseTotal', label: 'Доставка до нашего склада (партия)', required: false, type: 'number', suffix: '₽' },
  { name: 'photoVideoDesignTotal', label: 'Фото/Видео/Дизайн (партия)', required: false, type: 'number', suffix: '₽' },
  { name: 'certificationTotal', label: 'Сертификация (партия)', required: false, type: 'number', suffix: '₽' },
  { name: 'deliveryToMPWarehouseTotal', label: 'Доставка до склада МП (партия)', required: false, type: 'number', suffix: '₽' },
  { name: 'fulfillmentUnit', label: 'Фулфилмент на 1 ед.', required: false, type: 'number', suffix: '₽' },
  { name: 'priceBeforeDiscount', label: 'Цена до скидки', required: false, type: 'number', suffix: '₽' },
  { name: 'discountPercent', label: 'Скидка, %', required: false, type: 'number', suffix: '%' },
  { name: 'mpCommissionPercent', label: 'Комиссия МП, %', required: false, type: 'number', suffix: '%' },
  { name: 'logisticsToCustomerUnit', label: 'Логистика до клиента на 1 ед.', required: false, type: 'number', suffix: '₽' },
  { name: 'buyoutPercent', label: 'Выкуп, %', required: false, type: 'number', suffix: '%', defaultValue: '100' },
  { name: 'storagePerUnitPerDay', label: 'Хранение 1 ед. в день', required: false, type: 'number', suffix: '₽' },
  { name: 'promoPercent', label: 'Промо, %', required: false, type: 'number', suffix: '%' },
  { name: 'includeCertification', label: 'Учитывать сертификацию', required: false, type: 'checkbox' },
  { name: 'includePhotoVideoDesign', label: 'Учитывать фото/видео/дизайн', required: false, type: 'checkbox' }
];
