'use client'
import React, { useRef, useEffect, useState } from 'react'

const LiveFeed = () => {
    const videoRef = useRef(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isMounted = true

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                if (isMounted && videoRef.current) {
                    videoRef.current.srcObject = stream
                    videoRef.current.onloadedmetadata = () => videoRef.current?.play()
                }
            } catch (err) {
                console.error('[LiveFeed] Error accessing camera:', err)
                if (isMounted) setError('Camera access denied or unavailable')
            }
        }

        startCamera()

        return () => {
            isMounted = false
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop())
                videoRef.current.srcObject = null
            }
        }
    }, [])

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                {error}
            </div>
        )
    }

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
        />
    )
}

export default LiveFeed
