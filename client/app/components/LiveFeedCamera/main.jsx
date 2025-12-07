import React, { useEffect, useRef } from 'react'
import { useCameraStream } from '../../context/cameraContext'

const LiveFeed = () => {
    const localVideoRef = useRef(null) // Each LiveFeed gets its own ref
    const { stream, isStreamActive, error } = useCameraStream()

    useEffect(() => {
        if (stream && localVideoRef.current) {
            localVideoRef.current.srcObject = stream
            localVideoRef.current.onloadedmetadata = () => {
                localVideoRef.current?.play()
            }
        }
    }, [stream])

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                {error}
            </div>
        )
    }

    if (!isStreamActive) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                Initializing camera...
            </div>
        )
    }

    return (
        <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
        />
    )
}

export default LiveFeed