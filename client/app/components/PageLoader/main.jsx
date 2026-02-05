'use client';

import { useEffect, useState, useMemo, useSyncExternalStore } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useClipModelsContext } from '@/app/context/clipModelContext';
import { modelCache } from '@/app/utils/modelCache';
import { setModelsLoaded } from '@/app/store/slices/dashboardSlice';

// Hook to safely check if component is mounted (avoids hydration mismatch)
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const MODELS_TO_LOAD = [
  { path: '/models/people_counter/model.json', name: 'People Counter', type: 'tfjs' },
  { path: '/models/safekeep/model.json', name: 'Safekeep', type: 'tfjs' },
  { path: '/models/cleantrack/model.json', name: 'Cleantrack', type: 'tfjs' },
];

export default function PageLoader() {
  const dispatch = useDispatch();
  // Use ?? false to handle undefined from old persisted state
  const modelsLoaded = useSelector((state) => state.dashboard?.modelsLoaded ?? false);
  const { isModelLoaded, modelLoadProgress, error: modelError } = useClipModelsContext();
  
  const isMounted = useIsMounted();
  const [fadeOut, setFadeOut] = useState(false);
  const [currentModel, setCurrentModel] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: MODELS_TO_LOAD.length });
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('clip');
  const [loadingComplete, setLoadingComplete] = useState(false);

  const loadingWidth = useMemo(() => {
    if (stage === 'clip') {
      if (!modelLoadProgress || modelLoadProgress === 'Loading CLIP Models...') {
        return 10;
      } else if (modelLoadProgress.includes('Loading text model')) {
        return 25;
      } else if (modelLoadProgress.includes('Loading vision model')) {
        return 40;
      }
      return 5;
    } else if (stage === 'onnx') {
      const percentage = 40 + (progress.current / progress.total) * 60; 
      return Math.round(percentage);
    }
    return 5;
  }, [stage, modelLoadProgress, progress]);

  // Debug log to track loading state
  useEffect(() => {
    console.log('[PageLoader] State:', { isModelLoaded, modelsLoaded, stage, modelLoadProgress });
  }, [isModelLoaded, modelsLoaded, stage, modelLoadProgress]);

  useEffect(() => {
    if (!isModelLoaded || modelsLoaded) {
      console.log('[PageLoader] Waiting for CLIP models...', { isModelLoaded, modelsLoaded });
      return;
    }

    let isMountedLocal = true;

    async function loadTFJSModels() {
      try {
        setStage('onnx');

        for (let i = 0; i < MODELS_TO_LOAD.length; i++) {
          const m = MODELS_TO_LOAD[i];
          if (!isMountedLocal) return;

          setCurrentModel(m.name);
          setProgress({ current: i + 1, total: MODELS_TO_LOAD.length });

          console.log(`[PageLoader] 📦 Loading ${m.name} (${i + 1}/${MODELS_TO_LOAD.length})...`);

          // Load and cache the TensorFlow.js model
          await modelCache.load(m.path);

          console.log(`[PageLoader] ✅ ${m.name} loaded and cached`);
          console.log(`[PageLoader] Cache stats:`, modelCache.getStats());
        }

        if (isMountedLocal) {
          console.log(`[PageLoader] 🎉 All TensorFlow.js models pre-loaded successfully!`);
          console.log(`[PageLoader] Final cache stats:`, modelCache.getStats());

          // Mark models as loaded in Redux store (persisted to sessionStorage)
          dispatch(setModelsLoaded(true));

          setTimeout(() => setLoadingComplete(true), 1500);
        }
      } catch (err) {
        console.error('[PageLoader] ❌ Error loading TensorFlow.js models:', err);
        if (isMountedLocal) setError(`Failed to load models: ${err.message}`);
      }
    }

    loadTFJSModels();

    return () => { 
      isMountedLocal = false;
      console.log('[PageLoader] Component unmounting but keeping models cached');
    };
  }, [isModelLoaded, modelsLoaded, dispatch]);

  useEffect(() => {
    if (loadingComplete) {
      const t = setTimeout(() => setFadeOut(true), 500);
      return () => clearTimeout(t);
    }
  }, [loadingComplete]);

  // Don't render if not mounted yet (SSR), models already loaded, or loading complete with fadeout
  if (!isMounted || modelsLoaded || (loadingComplete && fadeOut)) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-background">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/xavant_logo_1.png" alt="Xavant Logo" className="max-w-xs w-full px-8" />
        <p className="text-foreground text-center">Powered by Smart Sensing & Gen AI</p>

        <div className="p-3 mt-4 w-[300px]">
          {stage === 'clip' && (
            <div className='w-full'>
              <p className="text-xs font-medium text-[#A6A6A6]">
                {modelLoadProgress || 'Loading CLIP Models...'}
              </p>
              {!modelError && (
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden relative">
                  <div
                    className="bg-[#85A3FF] h-full rounded-full absolute left-0 top-0"
                    style={{
                      width: `${loadingWidth}%`,
                      transition: 'width 0.3s ease-in-out'
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {stage === 'onnx' && (
            <div className='w-full'>
              <p className="text-xs font-medium text-[#A6A6A6]">
                Loading {currentModel} ({progress.current}/{progress.total})
              </p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden relative">
                <div
                  className="bg-[#85A3FF] h-full rounded-full absolute left-0 top-0"
                  style={{
                    width: `${loadingWidth}%`,
                    transition: 'width 0.3s ease-in-out'
                  }}
                />
              </div>
            </div>
          )}
          {(modelError || error) && (
            <p className="text-xs text-red-500 mt-2">
              {modelError || error}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-end justify-center py-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/accenture_logo.png" alt="Accenture Logo" className="max-w-[150px] w-full px-8" />
      </div>
    </div>
  );
}