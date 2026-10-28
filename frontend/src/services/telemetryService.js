import { http } from '../api/http.js';

const demoTelemetry = Array.from({ length: 24 }, (_, index) => ({
  key: index + 1,
  time: `28.10.2026 12:${String(index * 3 % 60).padStart(2, '0')}`,
  equipment: `ВЭУ-${String(index % 18 + 1).padStart(2, '0')}`,
  signal: ['Скорость ветра', 'Мощность', 'Температура', 'Вибрация'][index % 4],
  value: `${(10 + index * 2.3).toFixed(1)}`,
  level: index % 7 === 0 ? 'Критическое' : index % 3 === 0 ? 'Предупреждение' : 'Информация',
}));

const useDemoApi = import.meta.env.VITE_USE_DEMO_API === 'true';

const normalizeTelemetry = (items) => items.map((item) => ({
  key: item.id,
  time: item.received_at ? new Date(item.received_at).toLocaleString('ru-RU') : '—',
  equipment: item.equipment_id ? String(item.equipment_id) : '—',
  signal: item.signal_type || '—',
  value: `${item.raw_value ?? '—'}${item.unit ? ` ${item.unit}` : ''}`,
  level: item.is_fresh ? 'Информация' : 'Предупреждение',
}));

export const telemetryService = {
  getAll: async () => {
    if (useDemoApi) return demoTelemetry;
    const data = await http.get('/telemetry/signals');
    return normalizeTelemetry(Array.isArray(data) ? data : data.items || []);
  },
};
