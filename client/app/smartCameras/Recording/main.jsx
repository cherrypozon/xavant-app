'use client'
import React, { useRef, useState, useEffect } from 'react';
import {
    searchRecordings,
    clearDatabase
} from '../../utils/utils';
import { useCameraStream } from '../../context/cameraContext';
import { useRecording } from '../../context/recorderProviderContext';
import { useClipModelsContext } from '../../context/clipModelContext';
import Notification from '@/app/components/Notification/main';

const Recording = ({ onClose }) => {
    // Use recording context instead of local state
    const recordingContext = useRecording();
    const {
        isRecording,
        recordingDuration,
        selectedLocation,
        setSelectedLocation,
        savedLocation,
        sessionName,
        startRecording,
        stopRecording,
        resetSavedLocation
    } = recordingContext;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('Today');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchProgress, setSearchProgress] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [notifyOpen, setNotifyOpen] = useState(false);
    const [notifyMsg, setNotifyMsg] = useState("");

    // Use CLIP models from context instead of local hook
    const { getModels, isModelLoaded, modelLoadProgress, error: modelError } = useClipModelsContext();
    const { stream, isStreamActive } = useCameraStream();

    const locations = ['Select Location', 'North Entrance', 'South Entrance', 'Main Hall', 'Parking Lot'];
    const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

    const containerRef = useRef(null);
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);


    const triggerNotify = (msg) => {
        setNotifyMsg(msg);
        setNotifyOpen(true);
    };

    const toggleRecording = async () => {
        if (isRecording) {
            try {
                await stopRecording();
                triggerNotify('Recording saved successfully!');
            } catch (err) {
                console.error('[Recording] Error saving recording:', err);
                triggerNotify('Error saving recording: ' + err.message);
            }
        } else {
            if (selectedLocation === 'Select Location') {
                triggerNotify('Please select a camera location first');
                return;
            }

            if (!isStreamActive || !stream) {
                triggerNotify('Camera stream not available. Please check Live Feed.');
                return;
            }

            try {
                await startRecording(stream);
            } catch (err) {
                console.error('[Recording] Error starting recording:', err);
                triggerNotify('Error starting recording: ' + err.message);
            }
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            triggerNotify('Please enter a search query');
            return;
        }

        if (!isModelLoaded) {
            triggerNotify('AI models are still loading. Please wait...');
            return;
        }

        const { textModel, visionModel, tokenizer, processor } = getModels();

        if (!textModel || !tokenizer || !visionModel || !processor) {
            triggerNotify('AI models not ready. Please wait for models to finish loading.');
            return;
        }

        setIsSearching(true);
        setHasSearched(true); // Mark that a search has been performed
        setSearchProgress({ current: 0, total: 0, status: 'Preparing search...' });
        console.log(`[Recording] Searching for: "${searchQuery}"`);

        try {
            const results = await searchRecordings(
                searchQuery,
                textModel,
                tokenizer,
                visionModel,
                processor,
                10,
                selectedLocation !== 'Select Location' ? selectedLocation : null,
                (progress) => {
                    setSearchProgress(progress);
                }
            );

            setSearchResults(results);
            setSearchProgress(null);
            console.log(`[Recording] Found ${results.length} results`);
        } catch (err) {
            console.error('[Recording] Search error:', err);
            triggerNotify(`Search error: ${err.message}`);
            setSearchProgress(null);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearDatabase = async () => {
        console.log('[Recording] Clear database called');
        console.log('[Recording] resetSavedLocation type:', typeof resetSavedLocation);

        try {
            await clearDatabase();
            setSearchResults([]);

            // Call resetSavedLocation if it exists
            if (typeof resetSavedLocation === 'function') {
                resetSavedLocation();
            } else {
                console.error('[Recording] resetSavedLocation is not a function!');
                // Fallback: manually reset if function not available
                console.warn('[Recording] Using direct state reset fallback');
            }

            triggerNotify('All recordings cleared!');
            console.log('[Recording] Database cleared');
        } catch (err) {
            console.error('[Recording] Error clearing database:', err);
            triggerNotify('Error clearing database');
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className='w-full bg-[#3b455b] px-5 pt-4 pb-3 rounded-[10px] text-white' ref={containerRef}>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <p className='font-medium text-[16px]'>Archive</p>
                <img src="xIcon.svg" alt="close" className='cursor-pointer' onClick={onClose} />
            </div>

            {/* Record Button */}
            <div className='flex items-center gap-2 cursor-pointer' onClick={toggleRecording}>
                <div className={`relative w-5 h-3 rounded-full transition-colors ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}>
                    <div className={`absolute top-[2.2px] left-1 w-2 h-2 bg-white rounded-full transition-transform shadow-md ${isRecording ? 'left-2 top-[2.2px]' : 'left-1'}`}></div>
                </div>
                <h1 className='font-medium text-[14px]'>
                    {isRecording ? `Recording ${formatDuration(recordingDuration)}` : "Record"}
                </h1>
            </div>

            {/* Camera Location Dropdown */}
            <p className='font-medium text-[14px] mt-4 mb-2'>Camera Location</p>
            <div className='relative'>
                <div
                    className='w-full rounded-[10px] bg-[#4B5672] flex items-center justify-between px-4 py-2 mb-4 cursor-pointer'
                    onClick={() => !isRecording && setShowLocationDropdown(!showLocationDropdown)}
                >
                    <p className='text-[12px]'>{savedLocation || selectedLocation}</p>
                    <img
                        src="dropdownIcon.svg"
                        alt="dropdown"
                        className={`transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : 'rotate-0'}`}
                    />
                </div>
                {showLocationDropdown && !isRecording && (
                    <div className='absolute w-full bg-[#4B5672] rounded-[10px] -mt-2.5 mb-4 z-60 overflow-hidden'>
                        {locations.map((location, index) => (
                            <div
                                key={index}
                                className={`px-4 py-1.5 hover:bg-[#5a6483] cursor-pointer text-[12px] ${index === 0 ? 'bg-[#5a6483]' : ''}`}
                                onClick={() => {
                                    setSelectedLocation(location);
                                    setShowLocationDropdown(false);
                                }}
                            >
                                {location}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Session Info Display */}
            {!isRecording && savedLocation && (
                <div className='w-full rounded-[10px] bg-[#4B5672] p-3 mb-4'>
                    <div className='flex items-center justify-between mb-2'>
                        <p className='text-xs font-medium text-[#A6A6A6]'>{sessionName}</p>
                        <button
                            onClick={handleClearDatabase}
                            className='text-xs text-red-400 hover:text-red-300'
                        >
                            Clear All
                        </button>
                    </div>
                    <p className='text-xs text-green-400'>✓ Recording saved to database</p>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative w-full mb-3.5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isSearching && isModelLoaded && handleSearch()}
                    className="w-full rounded-[10px] bg-[#4B5672] px-10 py-2 text-[13px] placeholder:text-[13px] outline-none disabled:opacity-50"
                    placeholder={isModelLoaded ? "Search..." : "Loading AI models..."}
                    disabled={isSearching || !isModelLoaded}
                />
                <img
                    src="searchIcon.svg"
                    alt="search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                />
                <img
                    src="sendIcon.svg"
                    alt="send"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-50 ${isSearching || !isModelLoaded ? 'opacity-50' : 'cursor-pointer hover:opacity-80'}`}
                    onClick={!isSearching && isModelLoaded ? handleSearch : undefined}
                />
            </div>

            {/* Search Progress */}
            {isSearching && searchProgress && (
                <div className='bg-[#4B5672] rounded-[10px] p-3 mb-3'>
                    <p className='text-xs font-medium text-[#A6A6A6]'>{searchProgress.status}</p>
                    {searchProgress.total > 0 && (
                        <div className='mt-2 w-full bg-gray-700 rounded-full h-1 overflow-hidden relative'>
                            <div
                                className='bg-[#3B5BFF] h-full rounded-full absolute left-0 top-0'
                                style={{
                                    width: `${Math.min((searchProgress.current / searchProgress.total) * 100, 100)}%`,
                                    transition: 'width 0.3s ease-in-out'
                                }}
                            ></div>
                        </div>
                    )}
                </div>
            )}

            {/* Search Result Label */}
            <p className='font-medium text-[12px]'>Search Result ({searchResults.length} Found)</p>

            {/* Filters */}
            <div className='flex items-center gap-4 mt-4 mb-4 relative'>
                <div
                    className='relative rounded-[10px] bg-[#4B5672] w-[80%] px-4 py-2 flex items-center justify-between cursor-pointer'
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                >
                    <p className='text-[12px]'>{selectedDate}</p>
                    <img
                        src="dropdownIcon.svg"
                        alt="dropdown"
                        className={`transition-transform duration-200 ${showDateDropdown ? 'rotate-180' : 'rotate-0'}`}
                    />
                    {showDateDropdown && (
                        <div className='absolute top-full left-0 w-full bg-[#4B5672] rounded-[10px] mt-2 overflow-hidden z-10'>
                            {dateOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className='px-4 py-2 hover:bg-[#5a6483] cursor-pointer text-[12px]'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDate(option);
                                        setShowDateDropdown(false);
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='rounded-[10px] bg-[#4B5672] w-[20%] px-4 py-2 cursor-pointer hover:bg-[#5a6483]'>
                    <p className='text-[12px]'>All</p>
                </div>
            </div>

            {/* Search Results Grid */}
            {isSearching ? (
                <div className='flex items-center justify-center py-8'>
                    <p className='text-xs text-[#A6A6A6] font-medium'>Analyzing videos...</p>
                </div>
            ) : searchResults.length > 0 ? (
                <div className='grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pb-4 no-scrollbar'>
                    {searchResults.map((result, index) => (
                        <div key={index} className='relative rounded-[10px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'>
                            <img src={result.imageData} alt="result" className='w-full h-32 object-cover' />
                            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2'>
                                <p className='text-[10px] font-medium'>{result.location}</p>
                                <p className='text-[9px] text-gray-300'>{formatDate(result.recordingTimestamp)}</p>
                                <p className='text-[9px] text-gray-300'>Frame: {Math.floor(result.frameTimestamp / 1000)}s</p>
                                <p className='text-[9px] text-green-400'>Match: {(result.similarity * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex items-center justify-center py-8'>
                    <p className='text-xs text-[#A6A6A6]'>
                        {hasSearched ? 'I couldn\'t find any results. Try refining your search' : 'Record some footage and search!'}
                    </p>
                </div>
            )}

            <Notification
                open={notifyOpen}
                onClose={() => setNotifyOpen(false)}
                message={notifyMsg}
            />
        </div>
    );
};

export default Recording;