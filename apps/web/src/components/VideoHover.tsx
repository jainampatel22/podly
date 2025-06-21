'use client';

import { useRef } from 'react';

const data = [
  {
    videos: '/videos/addcaptions.webm',
    title: 'Captions',
    description: 'Add captions with engaging animations.',
    availability: "Soon"
  },
  {
    videos: '/videos/video1.webm',
    title: 'Magic Clips',
    description: 'Generate social shorts from longer videos.',
    availability: "PRO"
  },
  {
    videos: '/videos/showvideo.webm',
    title: 'Show Notes',
    description: 'Summaries, chapters & quotes with a click.',
    availability: "PRO"
  },
  {
    videos: '/videos/transcribe.webm',
    title: 'Transcribe',
    description: 'Import files to instantly transcribe.',
    availability: "Soon"
  },
];

export default function HoverVideoGrid() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (video && video.paused && video.currentTime === 0) {
      video.play();
    }
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (index: number) => {
    const video = videoRefs.current[index];
    if (video && video.paused && video.currentTime === 0) {
      video.play();
    }
  };

  const handleTouchEnd = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <>
      {/* Mobile Layout - Single Column */}
      <div className="block  sm:hidden px-4 mt-5">
        <div className="flex flex-col gap-y-8 max-w-sm mx-auto">
          {data.map((item, idx) => (
            <div
              key={idx}
              onTouchStart={() => handleTouchStart(idx)}
              onTouchEnd={() => handleTouchEnd(idx)}
              className="relative w-full h-64 rounded-2xl overflow-hidden cursor-pointer transform transition-transform duration-300 active:scale-95 touch-manipulation"
            >
              <video
                ref={(el) => {videoRefs.current[idx] = el}}
                muted
                className="w-full h-full object-cover"
                src={item.videos}
                playsInline
              />
              <div className="absolute top-2 right-2 border bg-black/60 text-blue-700 border-blue-700 text-white font-inter px-2 py-1 rounded-md text-xs">
                {item.availability}
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3">
                <h2 className="text-white font-semibold font-inter text-base">{item.title}</h2>
                <p className="text-gray-300 font-inter text-xs mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet Layout - 2 Columns */}
      <div className="hidden  sm:block lg:hidden px-6 mt-5">
        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
          {data.map((item, idx) => (
            <div
              key={idx}
              onTouchStart={() => handleTouchStart(idx)}
              onTouchEnd={() => handleTouchEnd(idx)}
              className="relative w-full h-72 rounded-2xl overflow-hidden cursor-pointer transform transition-transform duration-300 active:scale-95 touch-manipulation"
            >
              <video
                ref={(el) => {videoRefs.current[idx] = el}}
                muted
                className="w-full h-full object-cover"
                src={item.videos}
                playsInline
              />
              <div className="absolute top-2 right-2 border bg-black/60 text-blue-700 border-blue-700 text-white font-inter px-2 py-1 rounded-md text-sm">
                {item.availability}
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                <h2 className="text-white font-semibold font-inter text-lg">{item.title}</h2>
                <p className="text-gray-300 font-inter text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Original Style with Responsive Positioning */}
      <div className=" hidden lg:block">
        {/* Centering container for desktop */}
        <div className="flex justify-center mt-5">
          <div className="flex flex-col gap-y-14 max-w-md xl:max-w-lg 2xl:max-w-xl">
            {data.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className="relative w-[350px] xl:w-[400px] 2xl:w-[450px] h-[350px] xl:h-[400px] 2xl:h-[450px] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <video
                  ref={(el) => {videoRefs.current[idx] = el}}
                  muted
                  className="w-full h-full object-cover"
                  src={item.videos}
                  playsInline
                />
                <div className="absolute top-2 right-2 border bg-black/60 text-blue-700 border-blue-700 text-white font-inter px-2 py-1 rounded-md">
                  {item.availability}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h2 className="text-white font-semibold font-inter text-lg">{item.title}</h2>
                  <p className="text-gray-300 font-inter text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}