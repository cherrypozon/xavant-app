import React, { useState } from 'react'

const Recording = ({ onClose }) => {
    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    return (
        <div className='w-full bg-[#3b455b] px-5 pt-4 pb-1 rounded-[10px]'>
            <div className='flex items-center justify-between mb-6'>
                <p className='font-medium text-[16px]'>Archive</p>
                <img src="xIcon.svg" alt="close" className='cursor-pointer' onClick={onClose} />
            </div>
            <div className='flex items-center gap-2 cursor-pointer' onClick={toggleRecording}>
                <button
                    onClick={toggleRecording}
                    className="flex items-center gap-2 py-2 transition-colors cursor-pointer mt-0.5"
                >
                    <div className={`relative w-5 h-3 rounded-full transition-colors ${isRecording ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                        <div className={`absolute top-[2.2px] left-1 w-2 h-2 bg-white rounded-full transition-transform shadow-md ${isRecording ? 'left-2 top-[2.2px]' : 'left-1'
                            }`}></div>
                    </div>
                </button>
                <h1 className='font-medium text-[14px]'>{isRecording ? "Recording" : "Record"}</h1>
            </div>


            <p className='font-medium text-[14px] mt-4 mb-2'>Camera Location</p>
            <div className='w-full rounded-[10px] bg-[#4B5672] flex items-center justify-between px-4 py-2 mb-4'>
                <p className='text-sm'>Select Location</p>
                <img src="dropdownIcon.svg" alt="dropdown" />
            </div>
            <div className="relative w-full mb-3.5">
                <input
                    type="text"
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
                />

            </div>

            <p className='font-medium text-[14px]'>Search Results (0 Found)</p>
            <div className='flex items-center gap-4 mt-4 mb-6'>
                <div className='rounded-[10px] bg-[#4B5672] w-[80%] px-4 py-2 flex items-center justify-between'>
                    <p className='text-sm'>Today</p>
                    <img src="dropdownIcon.svg" alt="dropdown" />
                </div>
                <div className='rounded-[10px] bg-[#4B5672] w-[20%] px-4 py-2'>
                    <p className='text-sm'>All</p>
                </div>
            </div>
        </div>
    )
}

export default Recording