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
      state.userInfo = {
        ...action.payload,
        token: action.payload.token, // ✅ Ensure token is stored
      };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo'); // ✅ Ensure token is cleared on logout
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
