'use client';
import React from 'react'
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AreaActivityReport = ({ data }) => {
    return (
        <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="w-full table-auto text-left text-sm text-white">
                    <thead className="bg-slate-700 text-[11px] text-gray-300">
                        <tr>
                            <th className="py-2 px-3 text-[10px]">Area</th>
                            <th className="py-2 px-3 text-[10px]">Current Activity</th>
                            <th className="py-2 px-3 text-[10px]">Previous Activity</th>
                            <th className="py-2 px-3 text-[10px]">Change</th>
                            <th className="py-2 px-3 text-[10px]">Peak Hour</th>
                            <th className="py-2 px-3 text-[10px]">Average Duration</th>
                        </tr>
                    </thead>


                    <tbody>
                        {data?.map((item, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.05 }}
                                className="border-b border-slate-700 hover:bg-slate-700/40"
                            >
                                <td className="py-2 px-3 text-[10px] font-normal">{item.area}</td>
                                <td className="py-2 px-3 text-[10px]">{item.current} <span className='text-[#FFFFFFB3] ml-1.5'>Visits</span></td>
                                <td className="py-2 px-3 text-[10px]">{item.previous} <span className='text-[#FFFFFFB3] ml-1.5'>Visits</span></td>
                                <td
                                    className={`py-2 px-3 text-[10px] font-semibold ${item.change > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}
                                >
                                    {item.change > 0 ? '↑' : '↓'} {item.change}%
                                </td>
                                <td className="py-2 px-3 text-[10px] flex items-center gap-1">
                                    <Clock size={14} color="#85A3FF" /> {item.peak}
                                </td>
                                <td className="py-2 px-3 text-[10px]">{item.duration}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default AreaActivityReport;