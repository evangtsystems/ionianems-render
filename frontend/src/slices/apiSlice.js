import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  credentials: 'include', // Ensures cookies (JWT) are sent with requests
});

const baseQueryWithAuth = async (args, api, extra) => {
  const result = await baseQuery(args, api, extra);

  if (result.error) {
    const status = result.error.status;

    // If unauthorized (401) or forbidden (403), log out the user
    if (status === 401 || status === 403) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth, // Use the customized baseQuery
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
