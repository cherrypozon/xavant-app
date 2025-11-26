'use client';

import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

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
