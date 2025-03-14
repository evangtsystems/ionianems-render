import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload)); // ✅ Store token in localStorage
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear(); // ❗ Clears everything (cart, preferences, etc.)
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
