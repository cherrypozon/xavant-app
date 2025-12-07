'use client'
import React, { createContext, useContext, useState, useRef } from 'react';
import { startVideoRecording, stopAndSaveRecording } from '../utils/utils';

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
    const [savedLocation, setSavedLocation] = useState(null);
    const [recordingStartTime, setRecordingStartTime] = useState(null);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const durationIntervalRef = useRef(null);

    // Compute session name directly from state
    const sessionName = recordingStartTime
        ? `${selectedLocation} - ${new Date(recordingStartTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(',', '')}`
        : '';

    const startRecording = async (stream) => {
        if (selectedLocation === 'Select Location') {
            throw new Error('Please select a camera location first');
        }

        if (!stream) {
            throw new Error('Camera stream not available');
        }

        console.log(`[RecordingContext] Starting recording at ${selectedLocation}`);

        const recorder = startVideoRecording(stream);
        mediaRecorderRef.current = recorder.mediaRecorder;
        chunksRef.current = recorder.chunks;

        setIsRecording(true);
        setRecordingDuration(0);
        setSavedLocation(null);
        setRecordingStartTime(Date.now());

        // Update duration every second
        durationIntervalRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = async () => {
        console.log('[RecordingContext] Stopping recording');

        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }

        if (!mediaRecorderRef.current) {
            throw new Error('No active recording');
        }

        try {
            await stopAndSaveRecording(
                mediaRecorderRef.current,
                chunksRef.current,
                sessionName,
                selectedLocation
            );

            setIsRecording(false);
            setSavedLocation(selectedLocation);
            setRecordingDuration(0);

            // Reset refs
            mediaRecorderRef.current = null;
            chunksRef.current = [];
        } catch (error) {
            console.error('[RecordingContext] Error stopping recording:', error);
            setIsRecording(false);
            setRecordingDuration(0);
            mediaRecorderRef.current = null;
            chunksRef.current = [];

            throw error;
        }
    };

    const resetSavedLocation = () => {
        setSavedLocation(null);
        console.log('[RecordingContext] Saved location reset');
    };

    const value = {
        isRecording,
        recordingDuration,
        selectedLocation,
        setSelectedLocation,
        savedLocation,
        sessionName,
        startRecording,
        stopRecording,
        resetSavedLocation
    };

    return (
        <RecordingContext.Provider value={value}>
            {children}
        </RecordingContext.Provider>
    );
};