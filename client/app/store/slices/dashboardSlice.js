'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalCameras: 0,
    activeAlerts: 0,
    peopleCount: 0,
  },
  filters: {
    dateRange: null,
    selectedArea: null,
  },
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: () => initialState,
  },
});

export const {
  setStats,
  setFilters,
  setLoading,
  setError,
  clearError,
  resetDashboard,
} = dashboardSlice.actions;

export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectDashboardFilters = (state) => state.dashboard.filters;
export const selectDashboardLoading = (state) => state.dashboard.isLoading;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;
