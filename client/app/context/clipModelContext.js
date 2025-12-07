'use client'
import React, { createContext, useContext } from 'react';
import { useClipModels } from '../utils/utils';

const ClipModelsContext = createContext(null);

export const useClipModelsContext = () => {
    const context = useContext(ClipModelsContext);
    if (!context) {
        throw new Error('useClipModelsContext must be used within ClipModelsProvider');
    }
    return context;
};

export const ClipModelsProvider = ({ children }) => {
    // Load models once at the app level - they persist even if Recording component unmounts
    const clipModelsState = useClipModels();

    return (
        <ClipModelsContext.Provider value={clipModelsState}>
            {children}
        </ClipModelsContext.Provider>
    );
};