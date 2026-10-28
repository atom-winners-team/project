import { http } from '../api/http.js';

const demoEquipment = Array.from({ length: 18 }, (_, index) => ({
  key: index + 1,
  name: `ВЭУ-${String(index + 1).padStart(2, '0')}`,
  model: ['Vestas V90', 'Siemens Gamesa SG 5.X', 'Nordex N149'][index % 3],
  location: ['Кольская ВЭС', 'Белорусская ВЭС', 'Арктическая площадка'][index % 3],
  status: index % 7 === 0 ? 'На обслуживании' : 'В работе',
  power: `${2.5 + (index % 4)} МВт`,
}));

const useDemoApi = import.meta.env.VITE_USE_DEMO_API === 'true';

const normalizeEquipment = (items) => items.map((item, index) => ({
  key: item.id ?? index + 1,
  id: item.id,
  name: item.name || item.loadingIdOriginal || `Оборудование ${index + 1}`,
  model: item.attributes?.model || item.attributes?.['Модель'] || 'Не указана',
  location: item.attributes?.location || item.attributes?.['Площадка'] || 'Не указана',
  power: item.attributes?.power || item.attributes?.['Мощность'] || 'Не указана',
  status: item.status || 'В работе',
}));

export const equipmentService = {
  getAll: async () => {
    if (useDemoApi) return demoEquipment;
    const data = await http.get('/equipment');
    return normalizeEquipment(Array.isArray(data) ? data : data.items || []);
  },
};
