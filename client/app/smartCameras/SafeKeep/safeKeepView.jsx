'use client'
import React from 'react'
import SpeedDialCard from '@/app/components/SpeedDialCard/main'
import { Shield } from 'lucide-react'
import LiveFeed from '@/app/components/LiveFeedCamera/main';
import ZoomableVideo from '@/app/components/ZoomableVideo/main';

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
        <ZoomableVideo label='Live - North Entrance' className='w-[60%] h-full'>
          <LiveFeed />
        </ZoomableVideo>

        <div className="w-[40%] p-4 pr-2 flex flex-col">
          <div className="relative mb-5 flex items-center gap-1">
            <span className="text-muted text-xs">smart</span>
            <Shield className="w-3 h-3 text-muted" />
          </div>
          <div className="flex flex-col items-start gap-3 pr-8">
            <div className='flex gap-3'>
              <img src="alertSign.svg" alt="alert notification" />
              <p className='text-[#FF3737] text-sm font-medium'>ALERT: Unattended Item</p>
            </div>
            <div className='flex justify-between items-center w-full'>
              <p className='text-[12px] font-medium'>Item: Bag</p>
              <p className='text-[12px] font-medium'>ITime: 9:15</p>
              <p className="text-[12px] font-medium">
                Status:
                <span className="ml-2 px-3 py-1 rounded-[15px] border-[1.5px] border-[#FF3737A6] inline-flex items-center gap-2 text-[#FF3737]">
                  Not Assigned
                  <span>
                    <img src="dropdownIcon.svg" alt="dropdown icon" />
                  </span>
                </span>
              </p>
            </div>
            <div className='grid grid-cols-3 grid-rows-1 gap-4'>
              <p className="font-medium text-[12px]">Smart Sensing <span className='absolute'><img src="staffingIcon.svg" alt="" /></span></p>
              <p className='text-[12px] col-span-2'>An unattended bag has been detected in North Hallway B for the past 36 minutes.</p>
            </div>
            <p className='text-[#A6A6A6] text-[12px]'>Notes</p>
            <textarea name="text-area" id="text-area"
              className="w-full max-h-[100px] min-h-[100px] p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[12px] font-normal no-scrollbar resize-none"
              placeholder='Write your notes here...'>
            </textarea>
            <div className='flex gap-4 items-center w-full justify-end'>
              <button className="w-[17px] h-[17px] rounded-full border-2 border-[#85A3FF] text-[#85A3FF] text-[15px] flex items-center justify-center font-medium cursor-pointer">
                <span className="-mt-1">+</span>
              </button>
              <button className='bg-[#85A3FF] rounded-[15px] px-4 p-1 text-xs font-semibold cursor-pointer'>Submit</button>
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
                  <LiveFeed />
                  {/* <img
                    src={place.streamUrl}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  /> */}

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
