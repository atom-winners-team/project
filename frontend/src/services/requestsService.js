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
const normalizeRequest = (item) => ({
  key: item.id,
  id: item.id,
  number: `REQ-${item.id}`,
  equipmentRefId: item.equipment_ref_id ?? null,
  equipment_ref_id: item.equipment_ref_id ?? null,
  equipment_id: item.equipment_id ?? null,
  description: item.description || '',
  type: typeNames[item.type] || item.type,
  typeValue: item.type,
  priority_id: item.priority_id ?? null,
  planned_at: item.planned_at ?? null,
  snapshot_context: item.snapshot_context ?? null,
  date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : '—',
  status: statusNames[item.status] || item.status,
  statusValue: item.status,
  assigneeId: item.assignee_id ?? null,
});
const normalizeRequests = (items) => items.map(normalizeRequest);

export const requestsService = {
  getAll: async () => {
    if (useDemoApi) return demoRequests;
    const data = await http.get('/requests');
    return normalizeRequests(Array.isArray(data) ? data : data.items || []);
  },
  getById: async (id) => {
    if (useDemoApi) return demoRequests.find((item) => item.key === id);
    return normalizeRequest(await http.get(`/requests/${id}`));
  },
  create: (data) => useDemoApi ? Promise.resolve({ ...data, id: Date.now() }) : http.post('/requests', data),
  update: (id, data) => useDemoApi ? Promise.resolve({ id, ...data }) : http.patch(`/requests/${id}`, data),
  assign: (id, assigneeId) => useDemoApi ? Promise.resolve({ id, assignee_id: assigneeId }) : http.post(`/requests/${id}/assign`, { assignee_id: assigneeId }),
  changeStatus: (id, status) => useDemoApi ? Promise.resolve({ id, status }) : http.post(`/requests/${id}/status`, { status }),
};
