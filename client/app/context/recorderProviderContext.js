'use client'
import React, { createContext, useContext, useState, useRef } from 'react';
import { captureAndStoreFrame } from '../utils/utils';

const RecordingContext = createContext();

export const useRecording = () => {
    const context = useContext(RecordingContext);
    if (!context) {
        throw new Error('useRecording must be used within RecordingProvider');
    }
    return context;
};

export const RecordingProvider = ({ children }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState('Select Location');
    const [savedRecordings, setSavedRecordings] = useState([]); // Changed from savedLocation to array
    const [recordingStartTime, setRecordingStartTime] = useState(null);
    const [frameCount, setFrameCount] = useState(0);
    const [activeSessionName, setActiveSessionName] = useState(''); // Track active session
    const [activeLocation, setActiveLocation] = useState(''); // Lock location during recording

    const captureIntervalRef = useRef(null);
    const durationIntervalRef = useRef(null);
    const videoElementRef = useRef(null);

    // Compute session name from active session
    const sessionName = activeSessionName;

    const startRecording = async (stream, visionModel, processor) => {
        if (selectedLocation === 'Select Location') {
            throw new Error('Please select a camera location first');
        }

        if (!stream) {
            throw new Error('Camera stream not available');
        }

        if (!visionModel || !processor) {
            throw new Error('AI models not loaded');
        }

        console.log(`[RecordingContext] Starting recording at ${selectedLocation}`);

        const startTime = Date.now();
        setIsRecording(true);
        setRecordingDuration(0);
        setFrameCount(0);
        setRecordingStartTime(startTime);
        
        // Lock the location for this recording session
        setActiveLocation(selectedLocation);

        const generatedSessionName = `${selectedLocation} - ${new Date(startTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(',', '')}`;
        
        setActiveSessionName(generatedSessionName);

        // Get video element from stream
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElementRef.current = videoElement;
        
        await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                resolve();
            };
        });

        // Capture frame every 1 second
        captureIntervalRef.current = setInterval(async () => {
            try {
                await captureAndStoreFrame(
                    videoElement,
                    generatedSessionName,
                    activeLocation || selectedLocation, // Use locked location
                    visionModel,
                    processor
                );
                setFrameCount(prev => prev + 1);
            } catch (err) {
                console.error('[RecordingContext] Error capturing frame:', err);
            }
        }, 1000);

        // Update duration every second
        durationIntervalRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = async () => {
        console.log('[RecordingContext] Stopping recording');

        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
        }

        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }

        // Clean up video element
        if (videoElementRef.current) {
            videoElementRef.current.srcObject = null;
            videoElementRef.current = null;
        }

        setIsRecording(false);
        
        // Add this recording to the saved recordings array
        const newRecording = {
            sessionName: activeSessionName,
            location: activeLocation,
            frameCount: frameCount,
            timestamp: recordingStartTime
        };
        
        setSavedRecordings(prev => [...prev, newRecording]);
        
        const finalFrameCount = frameCount;
        console.log(`[RecordingContext] Recording stopped. Captured ${finalFrameCount} frames`);
        
        setRecordingDuration(0);
        setFrameCount(0);
        setActiveSessionName('');
        setActiveLocation('');
    };

    const resetSavedLocation = () => {
        setSavedRecordings([]);
        setFrameCount(0);
        console.log('[RecordingContext] All saved recordings cleared');
    };

    const value = {
        isRecording,
        recordingDuration,
        selectedLocation,
        setSelectedLocation,
        savedRecordings,
        sessionName,
        frameCount,
        startRecording,
        stopRecording,
        resetSavedLocation,
        activeLocation 
    };

    return (
        <RecordingContext.Provider value={value}>
            {children}
        </RecordingContext.Provider>
    );
};