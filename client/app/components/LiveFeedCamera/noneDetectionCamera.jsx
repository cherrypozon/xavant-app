'use client';

import { useRef, useEffect, useState } from 'react';

function SimpleCameraFeed({ className = "" }) {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });

        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (isMounted) {
              setIsStreaming(true);
            }
          };
        } else if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error('[SimpleCameraFeed] Error accessing camera:', err);
        if (isMounted) {
          setError(`Camera error: ${err.message}`);
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      console.log('[SimpleCameraFeed] Cleanup: stopping camera');

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      setIsStreaming(false);
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 p-4 bg-black">
        <div className="text-center">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-black ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      {!isStreaming && (
        <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
          📷 Starting camera...
        </div>
      )}
    </div>
  );
}

export default SimpleCameraFeed;