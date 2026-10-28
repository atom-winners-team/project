import { http } from '../api/http.js';

const roles = ['Администратор', 'Инженер', 'Оператор'];
const demoUsers = Array.from({ length: 16 }, (_, index) => ({
  key: index + 1,
  name: ['Алексей Иванов', 'Мария Смирнова', 'Дмитрий Петров', 'Анна Кузнецова'][index % 4],
  email: `user${index + 1}@rosatom.example`,
  role: roles[index % roles.length],
  status: index % 5 === 0 ? 'Заблокирован' : 'Активен',
}));

const useDemoApi = import.meta.env.VITE_USE_DEMO_API === 'true';

const roleNames = {
  duty_officer: 'Дежурный',
  service_engineer: 'Инженер',
  technical_director: 'Технический директор',
};

const normalizeUsers = (items) => items.map((item) => ({
  key: item.id,
  id: item.id,
  name: item.login,
  email: '—',
  role: roleNames[item.role] || item.role,
  status: 'Активен',
}));

export const usersService = {
  getAll: async () => {
    if (useDemoApi) return demoUsers;
    const data = await http.get('/users');
    return normalizeUsers(Array.isArray(data) ? data : data.items || []);
  },
};
