import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Collapse, IconButton, Tooltip, Switch, FormControlLabel, useTheme, Slide
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const MAIN_FIELDS = [
  { name: 'productName', label: 'Название товара (необязательно)', required: false },
  { name: 'marketplace', label: 'Маркетплейс (опционально)', required: false },
  { name: 'quantity', label: 'Количество', required: true, type: 'number', suffix: 'шт.' },
  { name: 'pricePurchaseUnit', label: 'Цена закупки за 1 ед.', required: true, type: 'number', suffix: '₽' },
  { name: 'priceSell', label: 'Цена продажи', required: true, type: 'number', suffix: '₽' },
  { name: 'deliveryTotal', label: 'Доставка до склада (партия)', required: true, type: 'number', suffix: '₽' },
  { name: 'packageTotal', label: 'Упаковка (партия)', required: true, type: 'number', suffix: '₽' },
  { name: 'marketplaceServicesPerUnit', label: 'Все услуги/комиссии МП (на 1 ед.)', required: true, type: 'number', suffix: '₽', tooltip: 'Комиссии, логистика, хранение и др. расходы на 1 ед.' },
  { name: 'taxRate', label: 'Ставка налога', required: true, type: 'number', suffix: '%', defaultValue: '6' },
];

const ADVANCED_FIELDS = [
  { name: 'certificationTotal', label: 'Сертификация', suffix: '₽', tooltip: 'Расходы на сертификацию' },
  { name: 'photoVideoDesignTotal', label: 'Фото/Видео/Дизайн', suffix: '₽', tooltip: 'Расходы на фото, видео, дизайн' },
  { name: 'fulfillmentUnit', label: 'Фулфилмент на 1 ед.', suffix: '₽' },
  { name: 'storagePerUnitPerDay', label: 'Хранение на 1 ед. в день', suffix: '₽' },
  { name: 'deliveryToMPWarehouseTotal', label: 'Доставка до склада МП (партия)', suffix: '₽' },
  { name: 'promoPercent', label: 'Промо, %', suffix: '%' },
  // Добавь другие расходы по необходимости
];

const DEMO_DATA = {
  productName: 'Футболка',
  marketplace: 'WB',
  quantity: '100',
  pricePurchaseUnit: '350',
  priceSell: '999',
  deliveryTotal: '2000',
  packageTotal: '500',
  marketplaceServicesPerUnit: '120',
  taxRate: '6',
  certificationTotal: '5000',
  photoVideoDesignTotal: '3000',
  fulfillmentUnit: '40',
  storagePerUnitPerDay: '1',
  deliveryToMPWarehouseTotal: '1500',
  promoPercent: '5',
};

const initialState = MAIN_FIELDS.concat(ADVANCED_FIELDS).reduce((acc, f) => {
  acc[f.name] = f.defaultValue || '';
  return acc;
}, {});

export default function SmartCalculator() {
  const [form, setForm] = useState(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [touched, setTouched] = useState({});
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const theme = useTheme();
  const firstEmptyRef = useRef(null);

  // Автофокус на первом пустом обязательном поле
  useEffect(() => {
    for (let f of MAIN_FIELDS) {
      if (f.required && !form[f.name]) {
        if (firstEmptyRef.current) firstEmptyRef.current.focus();
        break;
      }
    }
  }, [form]);

  // Валидация (простая)
  const validate = () => {
    const errors = {};
    MAIN_FIELDS.forEach(f => {
      if (f.required && !form[f.name]) errors[f.name] = 'Обязательное поле';
    });
    return errors;
  };

  const errors = validate();

  // Обработка изменения
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  // Демо-режим
  const handleDemo = () => {
    setForm({ ...form, ...DEMO_DATA });
    setTouched({});
  };

  // Сброс
  const handleReset = () => {
    setForm(initialState);
    setTouched({});
    setShowResults(false);
  };

  // Показать/скрыть расширенные
  const handleToggleAdvanced = () => setShowAdvanced(v => !v);

  // Расчет (заглушка)
  const handleCalculate = () => {
    // Здесь будет расчет прибыли/маржи на основе заполненных полей
    setResults({
      // Пример:
      profit: 12345,
      cost: 6789,
      expenses: ADVANCED_FIELDS.filter(f => form[f.name]).map(f => ({ label: f.label, value: form[f.name], suffix: f.suffix }))
    });
    setShowResults(true);
  };

  // Какие расходы показывать в итогах
  const usedAdvanced = ADVANCED_FIELDS.filter(f => form[f.name]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, bgcolor: '#fff', color: '#222', borderRadius: 3, p: 2, boxShadow: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Калькулятор маржи и прибыли</Typography>

      </Box>
      <Card sx={{ mb: 2, bgcolor: '#f9f9f9' }} elevation={2}>
        <CardContent>
          <Typography variant="h6" mb={2}>Основные параметры</Typography>
          {MAIN_FIELDS.map((f, idx) => (
            <Box key={f.name} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                inputRef={(!form[f.name] && f.required && !firstEmptyRef.current) ? firstEmptyRef : null}
                label={f.label}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                type={f.type || 'text'}
                required={f.required}
                error={!!errors[f.name] && touched[f.name]}
                helperText={touched[f.name] && errors[f.name]}
                InputProps={{ endAdornment: f.suffix ? <span style={{ color: '#888', marginLeft: 4 }}>{f.suffix}</span> : null }}
                fullWidth
                sx={{ bgcolor: '#fff' }}
              />
              {f.tooltip && (
                <Tooltip title={f.tooltip} placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}><InfoOutlinedIcon fontSize="small" /></IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button onClick={handleDemo} variant="outlined">Заполнить примером</Button>
            <Button onClick={handleReset} variant="outlined" color="secondary">Сбросить</Button>
            <Button onClick={handleToggleAdvanced} endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />} variant="contained" color="info">
              {showAdvanced ? 'Скрыть расширенные расходы' : 'Расширенные расходы'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Collapse in={showAdvanced} timeout={400}>
        <Card sx={{ mb: 2, bgcolor: '#f3f7fa' }} elevation={1}>
          <CardContent>
            <Typography variant="h6" mb={2}>Дополнительные расходы</Typography>
            {ADVANCED_FIELDS.map(f => (
              <Box key={f.name} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  label={f.label}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  type={f.type || 'number'}
                  InputProps={{ endAdornment: f.suffix ? <span style={{ color: '#888', marginLeft: 4 }}>{f.suffix}</span> : null }}
                  fullWidth
                  sx={{ bgcolor: '#fff' }}
                />
                {f.tooltip && (
                  <Tooltip title={f.tooltip} placement="top">
                    <IconButton size="small" sx={{ ml: 1 }}><InfoOutlinedIcon fontSize="small" /></IconButton>
                  </Tooltip>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Collapse>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          onClick={handleCalculate}
          variant="contained"
          color="success"
          disabled={Object.keys(errors).length > 0}
        >
          Рассчитать
        </Button>
      </Box>
      <Slide direction="up" in={showResults} mountOnEnter unmountOnExit timeout={400}>
        <Card sx={{ bgcolor: '#f7fff7', color: '#222', mt: 2 }} elevation={3}>
          <CardContent>
            <Typography variant="h6" mb={2}>Итоги</Typography>
            <Box>
              <Typography>Себестоимость: <b>{results?.cost || '...'}</b> ₽</Typography>
              <Typography>Прибыль: <b>{results?.profit || '...'}</b> ₽</Typography>
            </Box>
            {usedAdvanced.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1">Дополнительные расходы:</Typography>
                {usedAdvanced.map(f => (
                  <Typography key={f.name} sx={{ pl: 2 }}>
                    {f.label}: <b>{form[f.name]}</b> {f.suffix}
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Slide>
    </Box>
  );
}
