import { http } from '../api/http.js';

const useDemoApi = import.meta.env.VITE_USE_DEMO_API === 'true';

const roleNames = {
  duty: 'Дежурный',
  engineer: 'Инженер',
  director: 'Технический директор',
};

const roles = Object.keys(roleNames);
const demoUsers = Array.from({ length: 16 }, (_, index) => {
  const roleValue = roles[index % roles.length];
  return {
    key: index + 1,
    id: index + 1,
    name: ['Алексей Иванов', 'Мария Смирнова', 'Дмитрий Петров', 'Анна Кузнецова'][index % 4],
    email: `user${index + 1}@rosatom.example`,
    role: roleNames[roleValue],
    roleValue,
    status: index % 5 === 0 ? 'Заблокирован' : 'Активен',
  };
});

const normalizeUsers = (items) => items.map((item) => ({
  key: item.id,
  id: item.id,
  name: item.login,
  email: '—',
  role: roleNames[item.role] || item.role,
  roleValue: item.role,
  status: 'Активен',
}));

export const usersService = {
  getAll: async () => {
    if (useDemoApi) return demoUsers;
    const data = await http.get('/users');
    return normalizeUsers(Array.isArray(data) ? data : data.items || []);
  },
};
