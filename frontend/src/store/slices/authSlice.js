import { createSlice } from '@reduxjs/toolkit';

const readToken = () => {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
};

const getUserFromToken = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(payload));
  } catch {
    return null;
  }
};

const initialToken = readToken();

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: initialToken, user: getUserFromToken(initialToken || '') },
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.accessToken;
      state.user = action.payload.user || getUserFromToken(action.payload.accessToken);
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
