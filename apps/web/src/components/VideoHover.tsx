'use client';

import { useRef } from 'react';
export default function VideoHover() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
 const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video && video.paused && video.currentTime === 0) {
      video.play();
    }
  };
  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0; // Reset to first frame
    }
  };


  return (
    <div
      onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
      className="inline-block w-[300px] h-[300px] overflow-hidden rounded-md"
    >
      {/* <video
        ref={videoRef}
        loop
        muted
        className="w-full h-full object-cover"
        src="/videos/video1.webm"
      /> */}
      <div
      onMouseEnter={handleMouseEnter}
      className="w-[200px] h-[200px] rounded-md overflow-hidden"
    >
      <video
        ref={videoRef}
        muted
        className="w-full h-full object-cover"
        src="/videos/showvideo.webm"
        playsInline
      />
    </div>
    </div>
  );
}
