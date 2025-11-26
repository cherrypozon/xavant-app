'use client';
import React from 'react';

const AlertsList = ({ alerts = [] }) => {
    return (
        <div className="w-full bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-4 relative">
            <div className="space-y-3">
                {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start justify-between">
                        <div className="flex gap-2 w-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                            <div>
                                <p className="text-white font-medium text-[12px]">
                                    {alert.title}
                                </p>
                                <div className="w-full flex items-center justify-between gap-4 text-[10px] mt-2">
                                    {alert.item && (
                                        <p className="text-gray-300">Item: {alert.item}</p>
                                    )}
                                    {alert.category && (
                                        <p className="text-gray-300">Category: {alert.category}</p>
                                    )}
                                    {alert.time && (
                                        <p className="text-gray-300">Time: {alert.time}</p>
                                    )}
                                    {alert.status && (
                                        <p
                                            className={
                                                alert.status.toLowerCase() === 'assigned'
                                                    ? 'text-green-400'
                                                    : 'text-red-400'
                                            }
                                        >
                                            Status: {alert.status}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className="bg-[#594FFF] text-white font-medium text-[9px] px-2 py-0.5 rounded-[10px] cursor-pointer absolute right-4">
                            View Camera
                        </button>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default AlertsList;
