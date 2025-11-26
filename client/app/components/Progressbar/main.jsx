'use client'
import React from 'react'

const ProgressBar = ({ percent }) => {
    const adjustedPercent = percent * 2;
return (
    <div className="w-full flex items-center pr-[9px]">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden relative">
            <div
                className="h-full absolute right-0 top-0 rounded-full"
                style={{
                width: `${adjustedPercent}%`,
                background: "linear-gradient(90deg, #10D92E 0%, #98C322 60%, #E5B61C 100%)",
                }}
            ></div>
        </div>
        <span className="text-[11px] w-10 text-right">{percent}%</span>
    </div>
    );
};

export default ProgressBar; 