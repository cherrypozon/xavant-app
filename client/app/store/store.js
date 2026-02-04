'use client';

import { configureStore } from '@reduxjs/toolkit';

import dashboardReducer from './slices/dashboardSlice';
import smartCameraReducer from './slices/smartCamerasSlice';

export const store = configureStore({
  reducer: {
    // Slices
    dashboard: dashboardReducer,
    smartCameras: smartCameraReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;