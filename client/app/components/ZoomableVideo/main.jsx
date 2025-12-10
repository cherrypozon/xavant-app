'use client'
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsZoomed(false)
        }
    }

    return (
        <>
            {/* ALWAYS render children - just move them with CSS! */}
            <div 
                className={isZoomed ? 'fixed inset-0 flex items-center justify-center p-8 bg-[#1F2432] bg-opacity-90' : `relative ${className}`}
                style={{ 
                    zIndex: isZoomed ? 9999 : 'auto',
                    transition: 'all 0.3s ease-in-out'
                }}
                onClick={isZoomed ? handleBackdropClick : undefined}
            >
                <div 
                    className={isZoomed ? 'relative w-full h-full max-w-7xl max-h-[90vh]' : 'relative w-full h-full'}
                    onClick={isZoomed ? (e) => e.stopPropagation() : undefined}
                >
                    {/* Close button - only in zoom mode */}
                    {isZoomed && (
                        <button
                            onClick={handleCloseZoom}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors cursor-pointer z-50"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    )}

                    {/* Label */}
                    {showLabel && (
                        <div 
                            className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full z-10 ${
                                isZoomed ? 'bg-black/50 backdrop-blur-sm' : ''
                            }`}
                        >
                            <div className="w-2 h-2 rounded-full bg-[#00FF40] mt-0.5"></div>
                            <p className={`text-[12px] font-medium ${isZoomed ? 'text-white' : ''}`}>{label}</p>
                        </div>
                    )}

                    {/* Zoom button - only in normal mode */}
                    {!isZoomed && (
                        <div
                            className="absolute top-4 right-4 cursor-pointer z-10 hover:scale-110 transition-transform"
                            onClick={handleZoomClick}
                        >
                            <img src={zoomIconSrc} alt="zoom" />
                        </div>
                    )}

                    {/* Children - ALWAYS rendered, never unmounts! */}
                    <div className={`w-full h-full ${isZoomed ? 'rounded-lg overflow-hidden' : ''}`}>
                        {children}
                    </div>

                    {/* ESC hint - only in zoom mode */}
                    {isZoomed && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                            <p className="text-white text-sm">Press <span className="font-bold">ESC</span> to exit</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ZoomableVideo