// Конфиги полей для простого и расширенного режима калькулятора

export const simpleFields = [
  { name: 'productName', label: 'Название товара', required: false, type: 'text', placeholder: 'Введите название' },
  { name: 'pricePurchaseUnit', label: 'Цена закупки за 1 ед.', required: true, type: 'number', suffix: '₽' },
  { name: 'quantity', label: 'Количество', required: true, type: 'number', suffix: 'шт.' },
  { name: 'deliveryTotal', label: 'Доставка до склада (партия)', required: true, type: 'number', suffix: '₽' },
  { name: 'packageTotal', label: 'Упаковка (партия)', required: true, type: 'number', suffix: '₽' },
  { name: 'marketplaceServicesPerUnit', label: 'Услуги/комиссии МП (на 1 ед.)', required: true, type: 'number', suffix: '₽', tooltip: 'Комиссии, логистика, хранение и др. расходы на 1 ед.' },
  { name: 'priceSell', label: 'Цена продажи', required: true, type: 'number', suffix: '₽' },
  { name: 'taxRate', label: 'Ставка налога', required: true, type: 'number', suffix: '%', defaultValue: '6' },
  { name: 'goalProfit', label: 'Желаемая прибыль', required: false, type: 'number', suffix: '₽' }
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
