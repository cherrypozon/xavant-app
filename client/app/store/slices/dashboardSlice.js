'use client';

import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from '@/app/store/thunks/dashboardThunks';

const initialState = {
  // Navigation state (persisted)
  activeView: 'dashboard',
  sidebarCollapsed: false,
  modelsLoaded: false,
  // Dashboard data
  data: null,
  stats: {
    totalCameras: 0,
    activeAlerts: 0,
    peopleCount: 0,
  },
  filters: {
    dateRange: null,
    selectedArea: null,
  },
  isLoading: true,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Navigation actions
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setModelsLoaded: (state, action) => {
      state.modelsLoaded = action.payload;
    },
    // Dashboard actions
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
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
    },
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;

        // Auto-update stats from fetched data
        if (action.payload?.smart_cameras) {
          const { camera_feeds, safe_keep, people_counter } = action.payload.smart_cameras;
          state.stats.totalCameras = camera_feeds?.length || 0;
          state.stats.activeAlerts = safe_keep?.alerts?.length || 0;
          state.stats.peopleCount = parseInt(people_counter?.current_traffic?.count) || 0;
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch dashboard data';
      });
  },
});

export const {
  // Navigation actions
  setActiveView,
  setSidebarCollapsed,
  toggleSidebar,
  setModelsLoaded,
  // Dashboard actions
  setStats,
  setFilters,
  setLoading,
  setError,
  clearError,
  clearDashboardData,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;