'use client'
import React from 'react'
import SpeedDialCard from '@/app/components/SpeedDialCard/main'
import { Shield } from 'lucide-react';
import LiveFeed from '@/app/components/LiveFeedCamera/main';

const SafeKeep = () => {
  //update this part when actual integration happen
  const monitoredPlaces = [
    { name: "4F Hallway B", streamUrl: "sampleImage3.png" },
    { name: "Indoor Pool", streamUrl: "sampleImage4.png" },
    { name: "Main Reception", streamUrl: "sampleImage5.png" },
    { name: "Outdoor Pool", streamUrl: "sampleImage6.png" },
    { name: "North Entrance", streamUrl: "sampleImage7.png" },
  ];
  return (
    <div className="space-y-6 mb-8">
      {/* First Row - Large Empty Card */}
      <div className="overflow-hidden h-[370px] flex items-center gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]">
        <div className="w-[60%] relative h-full">
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full">
            <div className='w-2 h-2 rounded-full bg-[#00FF40] mt-0.5'></div>
            <p className='text-[12px] font-medium'>Live <span className='ml-5'>Hallway</span></p>
          </div>
          <div className='absolute top-4 right-4 cursor-pointer'><img src="zoomOut.svg" alt="zoom out" /></div>

          {/* uncomment this when actual camera feed is using then apply stream URL then delete img source below */}
          {/* <LiveFeed streamUrl="back end camera url" /> */}
          <img src="sampleImage2.png" alt="North Entrance" className='h-full w-full' />

        </div>
        <div className="w-[40%] py-4">
          <div className="relative mb-5 flex items-center gap-1">
            <span className="text-muted text-xs">smart</span>
            <Shield className="w-3 h-3 text-muted" />
          </div>
          <div className="flex items-start gap-4 pr-8">
            <div className='w-[45%] flex flex-col'>

            </div>
          </div>
        </div>
      </div>

      {/* Second Row - 6 Cards + Speed Dial */}
      <div className="grid grid-cols-12 gap-6 justify-center items-center">
        {/* Left Side - 6 Cards */}
        <div className="col-span-7">
          <h2 className="text-foreground text-[16px] font-medium mb-4">
            Key Monitored Places
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Mapping dynamic places */}
            {monitoredPlaces.map((place, idx) => (
              <div key={idx}>
                <div className="relative rounded-lg overflow-hidden h-[150px]">
                  {/* uncomment this when actual camera feed is using then apply stream URL then delete img source below */}
                  {/* <LiveFeed streamUrl="back end camera url" /> */}
                  <img
                    src={place.streamUrl}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)",
                      opacity: 0.1,
                    }}
                  ></div>

                  <div className="relative p-4"></div>
                </div>

                {/* Label */}
                <div className="text-[#A6A6A6] text-[12px] font-normal py-1 ml-1">
                  {place.name}
                </div>
              </div>
            ))}

            {/* Card 6 - More */}
            <div className="relative rounded-lg overflow-hidden h-[150px] flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)",
                  opacity: 0.1,
                }}
              ></div>
              <div className="relative flex flex-col items-center justify-center text-center">
                <div className="text-4xl font-light text-foreground mb-2">8+</div>
                <div className="text-sm text-muted">More</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Speed Dial Component */}
        <div className="col-span-5 -mt-10 -ml-3 pr-5">
          <SpeedDialCard />
        </div>
      </div>
    </div>
  )
}

export default SafeKeep
