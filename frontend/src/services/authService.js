import { http } from '../api/http.js';

const useDemoApi = import.meta.env.VITE_USE_DEMO_API === 'true';

export const authService = {
  async login({ login, password }) {
    const credentials = { login, password };
    if (useDemoApi) {
      return {
        accessToken: 'demo-token',
        user: { login, role: 'engineer' },
      };
    }
    return http.post('/auth/login', credentials);
  },

  async register({ login, password }) {
    const credentials = { login, password };
    if (useDemoApi) {
      return {
        accessToken: 'demo-token',
        user: { login, role: 'engineer' },
      };
    }
    await http.post('/auth/register', credentials);
    return http.post('/auth/login', credentials);
  },

  async logout() {
    localStorage.removeItem('accessToken');
  },
};
