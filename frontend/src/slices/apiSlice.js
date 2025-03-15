import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
<<<<<<< HEAD
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000', // ✅ Use local backend
  credentials: 'include', // ✅ Ensures cookies (JWT) are sent with requests
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token; // ✅ Get token from Redux

    if (token) {
      headers.set('Authorization', `Bearer ${token}`); // ✅ Attach token
      console.log("✅ Sending API Request with Token:", token);
    } else {
      console.warn("🚨 No Token Found! Requests May Fail.");
=======
  baseUrl: process.env.REACT_APP_API_URL || 'https://ionianems-backend.onrender.com',
  credentials: 'include', // ✅ Ensures cookies (JWT) are sent
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;  // ✅ Get token from Redux store
    if (token) {
      console.log("🔑 Attaching Token:", token);
      headers.set('Authorization', `Bearer ${token}`); // ✅ Attach token to every request
>>>>>>> fa0246cec0bda39b5c84f1aa105c26dd6e8a3bb7
    }

    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extra) => {
  const result = await baseQuery(args, api, extra);

  if (result.error) {
    const status = result.error.status;
<<<<<<< HEAD
=======
    console.error("🚨 API Error:", result.error);

    // If unauthorized (401) or forbidden (403), log out the user
>>>>>>> fa0246cec0bda39b5c84f1aa105c26dd6e8a3bb7
    if (status === 401 || status === 403) {
      console.warn("🚨 Token expired or invalid. Logging out user.");
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
