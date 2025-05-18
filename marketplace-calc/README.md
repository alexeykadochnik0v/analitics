# Калькулятор маржи и прибыли для маркетплейсов

Веб-приложение для расчета ключевых финансовых показателей при продаже товаров на маркетплейсах (Ozon, Wildberries и др.). Позволяет оценить прибыльность товара, рассчитать себестоимость, маржинальность и другие важные метрики.

## Функциональность

- Расчет себестоимости товара с учетом всех затрат
- Расчет валовой и чистой прибыли
- Расчет маржинальности
- Расчет оборотных средств
- Определение необходимого количества продаж для достижения целевой прибыли
- Сохранение расчетов в личном кабинете
- Просмотр истории расчетов

## Технологии

- React (Vite)
- React Router
- Firebase Authentication (Google Sign-In)
- Firebase Firestore (хранение данных)

## Установка и запуск

### Предварительные требования

- Node.js (версия 14 или выше)
- npm или yarn

### Шаги установки

1. Клонировать репозиторий:
```bash
git clone https://github.com/your-username/marketplace-calc.git
cd marketplace-calc
```

2. Установить зависимости:
```bash
npm install
```

3. Настроить Firebase:
   - Создать проект в [Firebase Console](https://console.firebase.google.com/)
   - Включить Authentication (Google provider)
   - Создать Firestore Database
   - Скопировать конфигурацию Firebase в файл `src/services/firebase.js`

4. Запустить приложение в режиме разработки:
```bash
npm run dev
```

## Деплой на GitHub Pages

1. Установить пакет gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Добавить в package.json:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
},
"homepage": "https://your-username.github.io/marketplace-calc"
```

3. Выполнить деплой:
```bash
npm run deploy
```

## Формулы расчетов

```javascript
// 1. Доставка на 1 ед.
deliveryPerUnit = deliveryTotal / quantity;

// 2. Упаковка на 1 ед.
packagePerUnit = packageTotal / quantity;

// 3. Себестоимость (сумма всех затрат)
costPrice = pricePurchaseUnit + deliveryPerUnit + packagePerUnit + marketplaceServicesPerUnit;

// 4. Валовая прибыль на 1 ед.
grossProfit = priceSell - costPrice;

// 5. Налог УСН
taxAmount = grossProfit * (taxRate / 100);

// 6. Чистая прибыль на 1 ед.
netProfit = grossProfit - taxAmount;

// 7. Маржинальность
margin = (netProfit / priceSell) * 100;

// 8. Оборотные средства
workingCapital = costPrice * quantity;

// 9. Нужно продать для цели
targetUnits = goalProfit / netProfit;
```

## Пример расчета

### Входные данные:
- Цена закупки за 1 ед.: 320 ₽
- Количество: 550 шт.
- Доставка до склада (вся партия): 1000 ₽
- Упаковка (вся партия): 3000 ₽
- Все услуги МП на 1 ед.: 375.82 ₽
- Цена продажи: 1200 ₽
- Ставка УСН: 6%

### Ожидаемые результаты:
- Доставка на 1 ед.: 1.82 ₽
- Упаковка на 1 ед.: 5.45 ₽
- Себестоимость: 703.09 ₽
- Валовая прибыль: 496.91 ₽
- Налог УСН: 29.81 ₽
- Чистая прибыль: 467.10 ₽
- Маржинальность: 38.92%
- Оборотные средства: 386,699.50 ₽

## Структура проекта

```
src/
├── components/         # Компоненты (InputField, ResultBlock и т.д.)
├── pages/              # Страницы (CalculatorPage, AuthPage, HistoryPage)
├── services/           # Сервисы (firebase.js, firestore.js, api.js)
├── utils/              # Утилиты (calcProfit.js)
├── App.jsx             # Основной компонент с роутингом
└── main.jsx            # Точка входа
```

## Лицензия

MIT
