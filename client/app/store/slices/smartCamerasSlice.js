'use client';

import { createSlice } from '@reduxjs/toolkit';
import { fetchSmartCamerasData } from '@/app/store/thunks/smartCamerasThunks';

const initialState = {
  data: null,
  cameras: [],
  selectedCamera: null,
  activeMode: null, // 'cleantrack' | 'peoplecounter' | 'safekeep'
  detections: [],
  safeKeepAlerts: [],
  cleanTrackTasks: [],
  peopleCounterData: null,
  isProcessing: false,
  isLoading: false,
  error: null,
};

const smartCameraSlice = createSlice({
  name: 'smartCamera',
  initialState,
  reducers: {
    setCameras: (state, action) => {
      state.cameras = action.payload;
    },
    addCamera: (state, action) => {
      state.cameras.push(action.payload);
    },
    removeCamera: (state, action) => {
      state.cameras = state.cameras.filter(
        (camera) => camera.camera_id !== action.payload
      );
    },
    setSelectedCamera: (state, action) => {
      state.selectedCamera = action.payload;
    },
    setActiveMode: (state, action) => {
      state.activeMode = action.payload;
    },
    addDetection: (state, action) => {
      state.detections.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    clearDetections: (state) => {
      state.detections = [];
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSmartCameraData: (state) => {
      state.data = null;
      state.error = null;
    },
    resetSmartCamera: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch smart camera data
      .addCase(fetchSmartCamerasData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSmartCamerasData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;

        // Auto-populate related data from fetched data
        if (action.payload?.smart_cameras) {
          const { camera_feeds, safe_keep, clean_track, people_counter } = action.payload.smart_cameras;
          
          state.cameras = camera_feeds || [];
          state.safeKeepAlerts = safe_keep?.alerts || [];
          state.cleanTrackTasks = clean_track?.tasks || [];
          state.peopleCounterData = people_counter || null;
        }
      })
      .addCase(fetchSmartCamerasData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch smart camera data';
      });
  },
});

export const {
  setCameras,
  addCamera,
  removeCamera,
  setSelectedCamera,
  setActiveMode,
  addDetection,
  clearDetections,
  setProcessing,
  setError,
  clearError,
  clearSmartCameraData,
  resetSmartCamera,
} = smartCameraSlice.actions;

export default smartCameraSlice.reducer;