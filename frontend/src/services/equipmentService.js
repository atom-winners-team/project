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
  loadingId: item.loadingId,
  inventoryNumber: item.inventory_number || item.attributes?.['Инвентарный №'] || '—',
  typicalRepair: item.typical_repair_code || item.attributes?.['Типовой ОР'] || '—',
  commissionedAt: item.commissioned_at || '—',
  manufacturedAt: item.manufactured_at || '—',
  isContextOnly: item.isContextOnly,
}));

export const equipmentService = {
  getAll: async () => {
    if (useDemoApi) return demoEquipment;
    const data = await http.get('/equipment');
    return normalizeEquipment(Array.isArray(data) ? data : data.items || []);
  },
  getById: async (id) => {
    if (useDemoApi) return demoEquipment.find((item) => item.key === Number(id));
    const item = await http.get(`/equipment/${id}`);
    return normalizeEquipment([item])[0];
  },
  getHistory: (id) => useDemoApi ? Promise.resolve([]) : http.get(`/equipment/${id}/history`),
  getUnmatchedHistory: () => useDemoApi ? Promise.resolve([]) : http.get('/equipment/history/unmatched'),
};
