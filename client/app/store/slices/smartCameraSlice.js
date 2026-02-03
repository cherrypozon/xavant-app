'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cameras: [],
  selectedCamera: null,
  activeMode: null, // 'cleantrack' | 'peoplecounter' | 'safekeep'
  detections: [],
  isProcessing: false,
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
        (camera) => camera.id !== action.payload
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
    resetSmartCamera: () => initialState,
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
  resetSmartCamera,
} = smartCameraSlice.actions;

export const selectSmartCameras = (state) => state.smartCamera.cameras;
export const selectSelectedCamera = (state) => state.smartCamera.selectedCamera;
export const selectActiveMode = (state) => state.smartCamera.activeMode;
export const selectDetections = (state) => state.smartCamera.detections;
export const selectIsProcessing = (state) => state.smartCamera.isProcessing;
export const selectSmartCameraError = (state) => state.smartCamera.error;

export default smartCameraSlice.reducer;
