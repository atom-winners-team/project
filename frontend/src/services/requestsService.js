import { http } from '../api/http.js';

const statuses = ['Новая', 'В работе', 'Выполнена'];
const demoRequests = Array.from({ length: 20 }, (_, index) => ({
  key: index + 1,
  number: `REQ-${1001 + index}`,
  equipment: `ВЭУ-${String((index % 18) + 1).padStart(2, '0')}`,
  type: ['Плановое обслуживание', 'Неисправность датчика', 'Осмотр конструкции'][index % 3],
  date: `28.10.${2026 - (index % 3)}`,
  status: statuses[index % statuses.length],
}));

const useDemoApi = import.meta.env.VITE_USE_DEMO_API === 'true';

const statusNames = { new: 'Новая', in_progress: 'В работе', waiting_parts: 'Ожидает детали', done: 'Выполнена', rejected: 'Отклонена' };
const typeNames = { inspection: 'Осмотр', repair: 'Ремонт' };
const normalizeRequests = (items) => items.map((item) => ({
  key: item.id,
  id: item.id,
  number: `REQ-${item.id}`,
  equipment: String(item.equipment_id || '—'),
  type: typeNames[item.type] || item.type,
  date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : '—',
  status: statusNames[item.status] || item.status,
}));

export const requestsService = {
  getAll: async () => {
    if (useDemoApi) return demoRequests;
    const data = await http.get('/requests');
    return normalizeRequests(Array.isArray(data) ? data : data.items || []);
  },
  getById: (id) => useDemoApi ? Promise.resolve(demoRequests.find((item) => item.key === id)) : http.get(`/requests/${id}`),
};
