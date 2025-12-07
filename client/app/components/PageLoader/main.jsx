'use client';

import { useEffect, useState, useMemo } from 'react';
import { useClipModelsContext } from '@/app/context/clipModelContext';

export default function PageLoader() {
  const { isModelLoaded, modelLoadProgress, error: modelError } = useClipModelsContext();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  // Calculate progress based on model loading state
  const progressPercent = useMemo(() => {
    if (isModelLoaded) return 100;
    
    if (modelLoadProgress) {
      const progressText = modelLoadProgress.toLowerCase();
      
      // Determine progress based on loading stage
      if (progressText.includes('loading vision model') || progressText.includes('vision model')) {
        return 100; // Vision model loading = 100%
      } else if (progressText.includes('loading text model') || progressText.includes('text model')) {
        return 50; // Text model loading = 50%
      } else if (progressText.includes('loading')) {
        return 25; // Initial loading state
      }
    }
    
    return 0;
  }, [modelLoadProgress, isModelLoaded]);

  useEffect(() => {
    if (isModelLoaded) {
      const timeout = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isModelLoaded]);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadTime = 3000; // Adjust time in milliseconds.

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!loading) return null;
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-background">
 

      {/* Xavant logo in the middle */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <img
          src="/xavant_logo_1.png"
          alt="Xavant Logo"
          className="max-w-xs w-full px-8"
        />
        <p className="text-foreground text-center">Powered by Smart Sensing & Gen AI</p>
        {!isModelLoaded && (
          <div className="p-3 mt-4 min-w-[300px]">
            <p className="text-xs font-medium text-[#A6A6A6]">
              {modelError ? (
                <span className="text-red-400">{modelError}</span>
              ) : (
                modelLoadProgress || 'Loading AI Models...'
              )}
            </p>
            {!modelError && (
              <div className="mt-2 w-full bg-gray-700 rounded-full h-1 overflow-hidden relative">
                <div
                  className="bg-[#3B5BFF] h-full rounded-full absolute left-0 top-0"
                  style={{
                    width: `${progressPercent}%`,
                    transition: 'width 0.3s ease-in-out'
                  }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>

 
      {/* Accenture logo at the bottom */}
      <div className="flex items-end justify-center py-8">
        <img
          src="/accenture_logo.png"
          alt="Accenture Logo"
          className="max-w-[150px] w-full px-8"
        />
      </div>
    </div>
  );
}