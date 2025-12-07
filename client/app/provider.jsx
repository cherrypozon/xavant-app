'use client';

import { CameraProvider } from './context/cameraContext';
import { RecordingProvider } from './context/recorderProviderContext';
import { ClipModelsProvider } from './context/clipModelContext';

export function Providers({ children }) {
  return (
    <CameraProvider>
      <ClipModelsProvider>
        <RecordingProvider>
          {children}
        </RecordingProvider>
      </ClipModelsProvider>
    </CameraProvider>
  );
}