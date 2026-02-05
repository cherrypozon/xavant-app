'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';

import dashboardReducer from './slices/dashboardSlice';
import smartCameraReducer from './slices/smartCamerasSlice';

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  smartCameras: smartCameraReducer,
});

const persistConfig = {
  key: 'xavant',
  storage,
  whitelist: ['dashboard', 'smartCameras'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default store;