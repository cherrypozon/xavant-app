'use client'
import React from 'react'

const LiveFeed = ({ streamURL }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoRef.current);
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = streamUrl;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streamUrl]);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
        ></video>
    );
}

export default LiveFeed