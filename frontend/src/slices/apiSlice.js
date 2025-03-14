import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || 'https://ionianems-backend.onrender.com',
  credentials: 'include', // ✅ Ensures cookies (JWT) are sent
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;  // ✅ Get token from Redux store
    if (token) {
      console.log("🔑 Attaching Token:", token);
      headers.set('Authorization', `Bearer ${token}`); // ✅ Attach token to every request
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extra) => {
  const result = await baseQuery(args, api, extra);

  if (result.error) {
    const status = result.error.status;
    console.error("🚨 API Error:", result.error);

    // If unauthorized (401) or forbidden (403), log out the user
    if (status === 401 || status === 403) {
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
