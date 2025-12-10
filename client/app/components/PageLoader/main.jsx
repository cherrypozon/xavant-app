'use client';

import { useEffect, useState, useMemo } from 'react';
import { useClipModelsContext } from '@/app/context/clipModelContext';
import { modelCache } from '@/app/utils/modelCache';

export default function PageLoader() {
  const MODELS_TO_LOAD = [
    { path: '/models/yolov8n.onnx', name: 'People Counter', type: 'onnx' },
    { path: '/models/yolov8n.onnx', name: 'Safekeep', type: 'onnx' },
    { path: '/models/yolov8n.onnx', name: 'Cleantrack', type: 'onnx' },
  ];

  const { isModelLoaded, modelLoadProgress, error: modelError } = useClipModelsContext();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentModel, setCurrentModel] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: MODELS_TO_LOAD.length });
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('clip');

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
  }, [stage, modelLoadProgress, progress.current, progress.total]);

  useEffect(() => {
    if (!isModelLoaded) return;

    let isMounted = true;

    async function loadOnnxModels() {
      try {
        setStage('onnx');

        for (let i = 0; i < MODELS_TO_LOAD.length; i++) {
          const m = MODELS_TO_LOAD[i];
          if (!isMounted) return;

          setCurrentModel(m.name);
          setProgress({ current: i + 1, total: MODELS_TO_LOAD.length });

          console.log(`[PageLoader] 📦 Loading ${m.name} (${i + 1}/${MODELS_TO_LOAD.length})...`);
          
          // Load and cache the ONNX model
          await modelCache.load(m.path);
          
          console.log(`[PageLoader] ✅ ${m.name} loaded and cached`);
          console.log(`[PageLoader] Cache stats:`, modelCache.getStats());
        }

        if (isMounted) {
          console.log(`[PageLoader] 🎉 All ONNX models pre-loaded successfully!`);
          console.log(`[PageLoader] Final cache stats:`, modelCache.getStats());
          
          setTimeout(() => setLoading(false), 1500);
        }
      } catch (err) {
        console.error('[PageLoader] ❌ Error loading ONNX models:', err);
        if (isMounted) setError(`Failed to load models: ${err.message}`);
      }
    }

    loadOnnxModels();

    return () => { 
      isMounted = false;
      console.log('[PageLoader] Component unmounting but keeping models cached');
    };
  }, [isModelLoaded]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!loading || !visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-background" suppressHydrationWarning>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
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
        <img src="/accenture_logo.png" alt="Accenture Logo" className="max-w-[150px] w-full px-8" />
      </div>
    </div>
  );
}