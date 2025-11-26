'use client';
import React from 'react';

const BellWithBadge = ({ size = 24, count = 1 }) => {
  return (
    <div className="relative inline-block cursor-pointer">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#85A3FF"
        stroke="#85A3FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>

      {count > 0 && (
        <span className="
          absolute -top-1 -right-1 
          bg-[#FF3737] text-white 
          w-4 h-4 text-[10px] 
          flex items-center justify-center 
          rounded-full font-medium
        ">
          {count}
        </span>
      )}
    </div>
  );
};

export default BellWithBadge;
