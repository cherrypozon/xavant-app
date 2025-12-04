'use client'
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { exp } from '@tensorflow/tfjs'

const ZoomableVideo = ({
    children,
    label = 'Live Feed',
    className = '',
    zoomIconSrc = 'zoomOut.svg',
    showLabel = true
}) => {
    const [isZoomed, setIsZoomed] = useState(false)

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && isZoomed) {
                setIsZoomed(false)
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isZoomed])

    useEffect(() => {
        if (isZoomed) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isZoomed])

    const handleZoomClick = () => {
        setIsZoomed(true)
    }

    const handleCloseZoom = () => {
        setIsZoomed(false)
    }

    return (
        <>
            <div className={`relative ${className}`}>
                {showLabel && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full z-10">
                        <div className="w-2 h-2 rounded-full bg-[#00FF40] mt-0.5"></div>
                        <p className="text-[12px] font-medium">{label}</p>
                    </div>
                )}
                <div
                    className="absolute top-4 right-4 cursor-pointer z-10 hover:scale-110 transition-transform"
                    onClick={handleZoomClick}
                >
                    <img src={zoomIconSrc} alt="zoom" />
                </div>
                {children}
            </div>
            {isZoomed && (
                <div className="fixed inset-0 bg-[#1F2432] bg-opacity-90 z-100 flex items-center justify-center p-8">
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                        <button
                            onClick={handleCloseZoom}
                            className="absolute top-4 right-4 z-101 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                        {showLabel && (
                            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm z-101">
                                <div className="w-2 h-2 rounded-full bg-[#00FF40] mt-0.5"></div>
                                <p className="text-[12px] font-medium text-white">{label}</p>
                            </div>
                        )}
                        <div className="w-full h-full">
                            {children}
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                            <p className="text-white text-sm">Press <span className="font-bold">ESC</span> to exit</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ZoomableVideo