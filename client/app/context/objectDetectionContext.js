'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { modelCache } from '@/app/utils/modelCache';

const YoloModelContext = createContext(null);

export function YoloModelProvider({ children }) {
  const [isYoloLoaded, setIsYoloLoaded] = useState(false);
  const [yoloLoadProgress, setYoloLoadProgress] = useState('Initializing YOLO...');
  const [yoloError, setYoloError] = useState(null);
  const [model, setModel] = useState(null);

  const YOLO_PATH = '/models/people_counter/model.json';

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setYoloLoadProgress('Loading YOLO model...');

        const loadedModel = await modelCache.load(YOLO_PATH, (progress) => {
          // progress is 0 → 1
          setYoloLoadProgress(`YOLO ${(progress * 100).toFixed(0)}% loaded`);
        });

        if (!mounted) return;

        setModel(loadedModel);
        setIsYoloLoaded(true);
        setYoloLoadProgress('YOLO loaded');
      } catch (err) {
        if (mounted) {
          setYoloError(err.message || 'Failed to load YOLO');
        }
      }
    }

    load();

    return () => {
      mounted = false;
      modelCache.release(YOLO_PATH);
    };
  }, []);

  return (
    <YoloModelContext.Provider
      value={{
        isYoloLoaded,
        yoloLoadProgress,
        yoloError,
        yoloModel: model
      }}
    >
      {children}
    </YoloModelContext.Provider>
  );
}

export const useYoloModelContext = () => useContext(YoloModelContext);
