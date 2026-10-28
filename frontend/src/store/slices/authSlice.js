import { createSlice } from '@reduxjs/toolkit';

const readToken = () => {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: readToken(), user: null },
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.accessToken;
      state.user = action.payload.user || null;
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
