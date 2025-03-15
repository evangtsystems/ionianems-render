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
<<<<<<< HEAD
      state.userInfo = {
        ...action.payload,
        token: action.payload.token, // ✅ Ensure token is stored
      };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo'); // ✅ Ensure token is cleared on logout
=======
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload)); // ✅ Store token in localStorage
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear(); // ❗ Clears everything (cart, preferences, etc.)
>>>>>>> fa0246cec0bda39b5c84f1aa105c26dd6e8a3bb7
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
<<<<<<< HEAD
=======

>>>>>>> fa0246cec0bda39b5c84f1aa105c26dd6e8a3bb7
export default authSlice.reducer;
