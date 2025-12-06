import React, { useState } from 'react'

const Recording = ({ onClose }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState('Select Location')
    const [savedLocation, setSavedLocation] = useState(null) // saved after recording
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDate, setSelectedDate] = useState('Today')
    const [showLocationDropdown, setShowLocationDropdown] = useState(false)
    const [showDateDropdown, setShowDateDropdown] = useState(false)

    const toggleRecording = () => {
        if (isRecording) {
            // Stop recording → save location
            if (!savedLocation) setSavedLocation(selectedLocation !== 'Select Location' ? selectedLocation : 'North Entrance')
        }
        setIsRecording(!isRecording)
    }

    const locations = ['Select Location', 'North Entrance', 'South Entrance', 'Main Hall', 'Parking Lot']
    const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']

    // Simulated recordings data
    const allRecordings = [
        { location: 'North Entrance', time: '10:00 AM', date: 'Nov 17, 2025' },
        { location: 'South Entrance', time: '10:05 AM', date: 'Nov 17, 2025' },
        { location: 'Main Hall', time: '10:30 AM', date: 'Nov 17, 2025' },
        { location: 'Parking Lot', time: '10:40 AM', date: 'Nov 17, 2025' },
        { location: 'North Entrance', time: '12:40 PM', date: 'Nov 17, 2025' },
        { location: 'North Entrance', time: '12:42 PM', date: 'Nov 17, 2025' },
    ]

    // Filter recordings by selectedLocation and search query
    const filteredRecordings = allRecordings.filter(r => {
        const matchLocation = selectedLocation === 'Select Location' || r.location === selectedLocation
        const matchSearch = searchQuery === '' || r.time.toLowerCase().includes(searchQuery.toLowerCase())
        return matchLocation && matchSearch
    })

    return (
        <div className='w-full bg-[#3b455b] px-5 pt-4 pb-3 rounded-[10px] text-white'>
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
                <h1 className='font-medium text-[14px]'>{isRecording ? "Recording" : "Record"}</h1>
            </div>

            {/* Camera Location Dropdown */}
            <p className='font-medium text-[14px] mt-4 mb-2'>Camera Location</p>
            <div className='relative'>
                <div
                    className='w-full rounded-[10px] bg-[#4B5672] flex items-center justify-between px-4 py-2 mb-4 cursor-pointer'
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                    <p className='text-[12px]'>{savedLocation || selectedLocation}</p>
                    <img
                        src="dropdownIcon.svg"
                        alt="dropdown"
                        className={`transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : 'rotate-0'}`}
                    />
                </div>
                {showLocationDropdown && (
                    <div className='absolute w-full bg-[#4B5672] rounded-[10px] -mt-2.5 mb-4 z-60 overflow-hidden'>
                        {locations.map((location, index) => (
                            <div
                                key={index}
                                className={`px-4 py-1.5 hover:bg-[#5a6483] cursor-pointer text-[12px] ${index === 0 ? 'bg-[#5a6483]' : ''}`}
                                onClick={() => {
                                    setSelectedLocation(location)
                                    setShowLocationDropdown(false)
                                }}
                            >
                                {location}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Location Preview */}
            {!isRecording && savedLocation && (
                <div className='w-full rounded-[10px] bg-[#4B5672] p-3 mb-4'>
                    <img src="sampleImage1.png" alt="camera view" className='w-full h-24 object-cover rounded-[8px] mb-2' />
                    <div className='flex gap-3 items-end'>
                        <p className='text-xs font-medium text-[#A6A6A6]'>{savedLocation}</p>
                        <p className='text-xs font-medium text-[#A6A6A6]'>Nov 17, 2025</p>
                        <p className='text-xs font-medium text-[#A6A6A6]'>10:00 AM - 6:00 PM</p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative w-full mb-3.5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-[10px] bg-[#4B5672] px-10 py-2 text-[13px] placeholder:text-[13px] outline-none"
                    placeholder="Search..."
                />
                <img
                    src="searchIcon.svg"
                    alt="search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                />
                <img
                    src="sendIcon.svg"
                    alt="send"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-50 cursor-pointer"
                    onClick={() => { }}
                />
            </div>

            {/* Search Result Label */}
            <p className='font-medium text-[12px]'>Search Result ({filteredRecordings.length} Found)</p>

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
                                        e.stopPropagation()
                                        setSelectedDate(option)
                                        setShowDateDropdown(false)
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
            {filteredRecordings.length > 0 && (
                <div className='grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pb-4 no-scrollbar'>
                    {filteredRecordings.map((result, index) => (
                        <div key={index} className='relative rounded-[10px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'>
                            <img src="sampleImage1.png" alt="result" className='w-full h-32 object-cover' />
                            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2'>
                                <p className='text-[10px] font-medium'>{result.location} - {result.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Recording
