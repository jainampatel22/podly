'use client';

import { useRef } from 'react';

const data = [
  {
    videos: '/videos/addcaptions.webm',
    title: 'Captions',
    description: 'Add captions with engaging animations.',
    availability:"Soon"
  },
  {
    videos: '/videos/video1.webm',
    title: 'Magic Clips',
    description: 'Generate social shorts from longer videos.',
    availability:"PRO"
  },
  {
    videos: '/videos/showvideo.webm',
    title: 'Show Notes',
    description: 'Summaries, chapters & quotes with a click.',
    availability:"PRO"
  },
  {
    videos: '/videos/transcribe.webm',
    title: 'Transcribe',
    description: 'Import files to instantly transcribe.',
    availability:"Soon"
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

  return (
    <div className="ml-[33%] mt-5 flex flex-col gap-y-14  ">
      {data.map((item, idx) => (
        <div
          key={idx}
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={() => handleMouseLeave(idx)}
          className="relative w-[350px] h-[350px] rounded-2xl   overflow-hidden"
        >
          <video
            ref={(el) => {videoRefs.current[idx] = el}}
            muted
            className="  w-full h-full object-cover"
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
  );
}
