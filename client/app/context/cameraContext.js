'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';


const CameraContext = createContext(null);

// Camera Provider Component
export function CameraProvider({ children }) {
  const [stream, setStream] = useState(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeCamera() {
      try {
        console.log('[CameraContext] Initializing camera...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });

        if (isMounted) {
          setStream(mediaStream);
          setIsStreamActive(true);
          console.log('[CameraContext] Camera initialized successfully');
        } else {
          // Component unmounted during async operation, stop stream
          mediaStream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error('[CameraContext] Error accessing camera:', err);
        if (isMounted) {
          setError('Camera access denied or unavailable');
        }
      }
    }

    initializeCamera();

    return () => {
      isMounted = false;
      console.log('[CameraContext] Cleanup: stopping camera');
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`[CameraContext] Stopped track: ${track.kind}`);
        });
      }
      setStream(null);
      setIsStreamActive(false);
    };
  }, []);

  const value = {
    stream,
    isStreamActive,
    error
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCameraStream() {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraStream must be used within CameraProvider');
  }
  return context;
}

export { CameraContext };