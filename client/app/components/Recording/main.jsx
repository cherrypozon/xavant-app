'use client'
import React, { useRef, useState, useEffect } from 'react';
import { searchRecordings, clearDatabase } from '../../utils/utils';
import { useCameraStream } from '../../context/cameraContext';
import { useRecording } from '../../context/recorderProviderContext';
import { useClipModelsContext } from '../../context/clipModelContext';
import Notification from '@/app/components/Notification/main';

const Recording = ({ onClose }) => {
    const recordingContext = useRecording();
    const {
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
    } = recordingContext;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResultCount, setSelectedResultCount] = useState(5);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [allSearchResults, setAllSearchResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchProgress, setSearchProgress] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [notifyOpen, setNotifyOpen] = useState(false);
    const [notifyMsg, setNotifyMsg] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const { getModels, isModelLoaded, modelLoadProgress, error: modelError } = useClipModelsContext();
    const { stream, isStreamActive } = useCameraStream();

    const locations = ['Select Location', 'North Entrance', 'South Entrance', 'Main Hall', 'Parking Lot'];

    const containerRef = useRef(null);

    // Update displayed results when count changes
    useEffect(() => {
        if (allSearchResults.length > 0) {
            setSearchResults(allSearchResults.slice(0, selectedResultCount));
        }
    }, [selectedResultCount, allSearchResults]);

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

            if (!isModelLoaded) {
                triggerNotify('AI models are still loading. Please wait...');
                return;
            }

            const { visionModel, processor } = getModels();

            if (!visionModel || !processor) {
                triggerNotify('AI models not ready. Please wait...');
                return;
            }

            try {
                await startRecording(stream, visionModel, processor);
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

        const { textModel, tokenizer } = getModels();

        if (!textModel || !tokenizer) {
            triggerNotify('AI models not ready. Please wait for models to finish loading.');
            return;
        }

        setIsSearching(true);
        setShowResults(false);
        setHasSearched(true);
        setSearchProgress({ current: 0, total: 0, status: 'Initializing search...' });
        console.log(`[Recording] Searching for: "${searchQuery}"`);

        try {
            const results = await searchRecordings(
                searchQuery,
                textModel,
                tokenizer,
                10, // Always fetch top 10 results
                null, // Search across ALL locations
                (progress) => {
                    setSearchProgress(progress);
                }
            );

            // Add a 2-3 second animation delay before showing results
            setSearchProgress({
                current: 100,
                total: 100,
                status: 'Finalizing results...'
            });

            // Wait 2.5 seconds before displaying results
            await new Promise(resolve => setTimeout(resolve, 2500));

            setAllSearchResults(results); // Store all results
            setSearchResults(results.slice(0, selectedResultCount)); // Display selected count
            setSearchProgress(null);
            setShowResults(true);
            console.log(`[Recording] Total results: ${results.length}`);

            if (results.length === 0) {
                triggerNotify('No matches found. Try a different search term.');
            }
        } catch (err) {
            console.error('[Recording] Search error:', err);

            let errorMsg = 'Search error';

            if (err.message.includes('too short')) {
                errorMsg = 'Search query is too short';
            } else if (err.message.includes('Models not')) {
                errorMsg = 'AI models are still loading. Please wait...';
            } else {
                errorMsg = `Search error: ${err.message}`;
            }

            triggerNotify(errorMsg);
            setSearchProgress(null);
            setShowResults(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearDatabase = async () => {
        console.log('[Recording] Clear database called');

        try {
            await clearDatabase();
            setSearchResults([]);
            setAllSearchResults([]);
            setShowResults(false);

            if (typeof resetSavedLocation === 'function') {
                resetSavedLocation();
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
                <div className={`relative w-5 h-3 rounded-full transition-colors ${isRecording ? 'bg-red-500' : 'bg-[#4B5672]'}`}>
                    <div className={`absolute top-[2.2px] left-1 w-2 h-2 bg-white rounded-full transition-transform shadow-md ${isRecording ? 'left-2 top-[2.2px]' : 'left-1'}`}></div>
                </div>
                <h1 className='font-medium text-[14px]'>
                    {isRecording ? `Recording ${formatDuration(recordingDuration)}` : "Record"}
                </h1>
            </div>

            {/* Live Recording Indicator */}
            {isRecording && (
                <div className='mt-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg'>
                    <p className='text-xs text-red-300'>
                        🔴 Live Recording • {frameCount} frames captured
                    </p>
                </div>
            )}

            {/* Camera Location Dropdown */}
            <p className='font-medium text-[14px] mt-4 mb-2'>Camera Location</p>
            <div className='relative'>
                <div
                    className='w-full rounded-[10px] bg-[#4B5672] flex items-center justify-between px-4 py-2 mb-4 cursor-pointer'
                    onClick={() => !isRecording && setShowLocationDropdown(!showLocationDropdown)}
                >
                    {/* Show active location during recording, otherwise show selected */}
                    <p className='text-[12px]'>{isRecording ? activeLocation : selectedLocation}</p>
                    <img
                        src="dropdownIcon.svg"
                        alt="dropdown"
                        className={`transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : 'rotate-0'} ${isRecording ? 'opacity-50' : ''}`}
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
            {!isRecording && savedRecordings.length > 0 && (
                <div className='w-full rounded-[10px] bg-[#4B5672] p-3 mb-4 max-h-[150px] overflow-y-auto no-scrollbar'>
                    <div className='flex items-center justify-between mb-2'>
                        <p className='text-xs font-medium text-[#A6A6A6]'>Saved Recordings ({savedRecordings.length})</p>
                        <button
                            onClick={handleClearDatabase}
                            className='text-xs text-red-400 hover:text-red-300 cursor-pointer'
                        >
                            Clear All
                        </button>
                    </div>
                    <div className='space-y-2'>
                        {savedRecordings.map((recording, index) => (
                            <div key={index} className='bg-[#3b455b] rounded-lg p-2'>
                                <p className='text-[11px] font-medium text-[#A6A6A6]'>{recording.sessionName}</p>
                                <p className='text-[10px] text-green-400 mt-1'>✓ {recording.frameCount} frames captured</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative w-full mb-3.5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
                    className="w-full rounded-[10px] bg-[#4B5672] px-10 py-2 text-[13px] placeholder:text-[13px] outline-none disabled:opacity-50"
                    placeholder="Search across all recordings..."
                    disabled={isSearching}
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
                <div className='bg-[#4B5672] rounded-[10px] p-4 mb-3'>
                    <div className='flex items-center justify-between mb-2'>
                        <p className='text-xs font-medium text-[#A6A6A6]'>{searchProgress.status}</p>
                    </div>
                    {searchProgress.total > 0 && (
                        <div className='w-full bg-[#4B5672] rounded-full h-1.5 overflow-hidden relative'>
                            <div
                                className='bg-linear-to-r from-[#3B5BFF] to-[#5B7BFF] h-full rounded-full absolute left-0 top-0'
                                style={{
                                    width: `${Math.min((searchProgress.current / searchProgress.total) * 100, 100)}%`,
                                    transition: 'width 0.3s ease-in-out'
                                }}
                            >
                                <div className='absolute inset-0 bg-white/20 animate-shimmer'></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Search Result Label */}
            {showResults && (
                <p className='font-medium mb-3 text-[12px]'>
                    Search Result ({searchResults.length} Found)
                </p>
            )}

            {/* Result Count Slider */}
            {showResults && (
                <div className='bg-[#4B5672] rounded-[10px] px-4 py-2 mb-3'>
                    <div className='flex items-center justify-between'>
                        <p className='text-[12px] font-medium text-[#A6A6A6]'>Top K result</p>
                        <p className='text-[12px] font-medium text-[#A6A6A6]'>{selectedResultCount}</p>
                    </div>
                    <div className='relative'>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={selectedResultCount}
                            onChange={(e) => setSelectedResultCount(parseInt(e.target.value))}
                            className='w-full h-1.5 rounded-full appearance-none cursor-pointer slider outline-none'
                            style={{
                                background: `linear-gradient(to right, #3B5BFF 0%, #3B5BFF ${((selectedResultCount - 1) / 9) * 100}%, #3b455b ${((selectedResultCount - 1) / 9) * 100}%, #3b455b 100%)`
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Search Results Grid */}
            {showResults && (
                <>
                    {searchResults.length > 0 ? (
                        <div className='relative'>
                            {/* Tooltip - Shows above grid */}
                            {hoveredIndex !== null && searchResults[hoveredIndex] && (
                                <div
                                    className='absolute left-1/2 -translate-x-1/2 mb-3 z-50 animate-tooltip'
                                    style={{
                                        bottom: '100%',
                                        width: '80%',
                                        maxWidth: '400px'
                                    }}
                                >
                                    <div className='relative rounded-[10px] overflow-hidden shadow-2xl'>
                                        <img
                                            src={searchResults[hoveredIndex].imageData}
                                            alt="result"
                                            className='w-full object-cover'
                                        />
                                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-2'>
                                            <p className='text-[14px] font-semibold mb-2'>{searchResults[hoveredIndex].location}</p>
                                            <p className='text-[12px] text-gray-200 mb-1'>
                                                {formatDate(searchResults[hoveredIndex].recordingTimestamp)}
                                            </p>
                                            <p className='text-[12px] text-green-400 font-medium'>
                                                Match: {(searchResults[hoveredIndex].similarity * 100).toFixed(1)}%
                                            </p>
                                            {searchResults[hoveredIndex].frameNumber && (
                                                <p className='text-[12px] text-gray-300 mt-1'>
                                                    Frame #{searchResults[hoveredIndex].frameNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grid */}
                            <div className='grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pb-4 no-scrollbar'>
                                {searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className='relative rounded-[10px] overflow-hidden cursor-pointer group'
                                        style={{
                                            animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s forwards`,
                                            opacity: 0
                                        }}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <img src={result.imageData} alt="result" className='w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105' />
                                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2'>
                                            <p className='text-[10px] font-medium truncate'>{result.location}</p>
                                            <p className='text-[9px] text-gray-300 truncate'>
                                                {formatDate(result.recordingTimestamp)}
                                            </p>
                                            <p className='text-[9px] text-green-400'>Match: {(result.similarity * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center py-8'>
                            <p className='text-xs text-[#A6A6A6]'>
                                {hasSearched ? 'I couldn\'t find any results. Try refining your search' : 'Record some footage and search!'}
                            </p>
                        </div>
                    )}
                </>
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