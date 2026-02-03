'use client';

import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import dashboardReducer from './slices/dashboardSlice';
import smartCameraReducer from './slices/smartCameraSlice';

// Import API slices
import { dashboardApi } from './api/dashboardApi';
import { smartCameraApi } from './api/smartCameraApi';

export const store = configureStore({
  reducer: {
    // Slices
    dashboard: dashboardReducer,
    smartCamera: smartCameraReducer,
    
    // API reducers
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [smartCameraApi.reducerPath]: smartCameraApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(dashboardApi.middleware, smartCameraApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
