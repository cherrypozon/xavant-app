'use client';

import { CameraProvider } from './context/cameraContext';
import { RecordingProvider } from './context/recorderProviderContext';
import { ClipModelsProvider } from './context/clipModelContext';
import { StoreProvider } from './store/StoreProvider';

export function Providers({ children }) {
  return (
    <StoreProvider>
      <CameraProvider>
        <ClipModelsProvider>
          <RecordingProvider>
            {children}
          </RecordingProvider>
        </ClipModelsProvider>
      </CameraProvider>
    </StoreProvider>
  );
}