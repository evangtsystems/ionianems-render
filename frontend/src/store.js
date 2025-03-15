import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import { apiSlice } from './slices/apiSlice';

// ✅ Define the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// ✅ Expose Redux store for debugging
if (typeof window !== 'undefined') {
  window.store = store;
  console.log('✅ Redux Store Available: window.store');
}

export default store;
