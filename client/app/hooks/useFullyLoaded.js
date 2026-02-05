'use client';

import { useAppSelector } from '@/app/store/hooks';
import { useCameraStream } from '@/app/context/cameraContext';
import { useClipModelsContext } from '@/app/context/clipModelContext';

/**
 * Custom hook that combines all loading states:
 * - Component data loading (from Redux)
 * - CLIP models loading
 * - Camera stream loading
 * 
 * Returns true only when everything is ready.
 */
export function useFullyLoaded(slice = 'dashboard') {
  // Get data loading state from the appropriate slice
  const dashboardState = useAppSelector((state) => state.dashboard);
  const smartCamerasState = useAppSelector((state) => state.smartCameras);
  
  const sliceState = slice === 'dashboard' ? dashboardState : smartCamerasState;
  const isDataLoading = sliceState?.isLoading ?? true;
  
  // Get models loaded state (persisted in Redux)
  const modelsLoaded = dashboardState?.modelsLoaded ?? false;
  
  // Get CLIP models state (stored globally, should be instant if already loaded)
  const { isModelLoaded: clipModelsLoaded } = useClipModelsContext();
  
  // Get camera state (stored globally, should be instant if already active)
  const { isStreamActive: cameraReady } = useCameraStream();
  
  // Everything is loaded when:
  // 1. Data is not loading (API call finished)
  // 2. Models are loaded (persisted state)
  // 3. CLIP models are loaded
  // 4. Camera is ready
  const isFullyLoaded = !isDataLoading && modelsLoaded && clipModelsLoaded && cameraReady;
  
  // Debug log (remove in production)
  console.log('[useFullyLoaded]', { 
    slice, 
    isDataLoading, 
    modelsLoaded, 
    clipModelsLoaded, 
    cameraReady, 
    isFullyLoaded 
  });
  
  return {
    isFullyLoaded,
    isDataLoading,
    modelsLoaded,
    clipModelsLoaded,
    cameraReady,
  };
}

/**
 * Simpler hook that only checks data + models (not camera)
 * Use this for components that don't need camera
 */
export function useDataAndModelsLoaded(slice = 'dashboard') {
  const dashboardState = useAppSelector((state) => state.dashboard);
  const smartCamerasState = useAppSelector((state) => state.smartCameras);
  
  const sliceState = slice === 'dashboard' ? dashboardState : smartCamerasState;
  const isDataLoading = sliceState?.isLoading ?? true;
  
  const modelsLoaded = dashboardState?.modelsLoaded ?? false;
  const { isModelLoaded: clipModelsLoaded } = useClipModelsContext();
  
  const isLoaded = !isDataLoading && modelsLoaded && clipModelsLoaded;
  
  return {
    isLoaded,
    isDataLoading,
    modelsLoaded,
    clipModelsLoaded,
  };
}
