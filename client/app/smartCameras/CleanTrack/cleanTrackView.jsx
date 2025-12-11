'use client'
import React from 'react';
import SpeedDialCard from '@/app/components/SpeedDialCard/main';
import { Shield, X } from 'lucide-react';
import ZoomableVideo from '@/app/components/ZoomableVideo/main';
import LiveFeed from '@/app/components/LiveFeedCamera/main';
import SimpleCameraFeed from '@/app/components/LiveFeedCamera/noneDetectionCamera';
import { COCO_CLASSES } from '@/app/constants/modelClasses';

const CleanTrack = () => {
  const dropdownFields = ['Area', 'Item', 'Category', 'Priority', 'Status']

  const monitoredPlaces = [
    { id: 1, streamUrl: 'sampleImage1.png', alt: '4F Hallway B' },
    { id: 2, streamUrl: 'sampleImage2.png', alt: 'Indoor Pool' },
    { id: 3, streamUrl: 'sampleImage3.png', alt: 'Main Reception' },
    { id: 4, streamUrl: 'sampleImage4.png', alt: 'Outdoor Pool' },
    { id: 5, streamUrl: 'sampleImage5.png', alt: 'More' },
  ]

  const tableRows = [
    { area: 'North Hall B', item: 'Towels', category: 'Urgent', status: 'Assigned', remarks: 'Multiple towels and some...' },
    { area: 'Indoor Pool', item: 'Wet floor', category: 'Non-Urgent', status: 'Assigned', remarks: 'Wet floor, accident risk' },
    { area: 'Elevator Hall A', item: 'Bellman cart', category: 'Non-Urgent', status: 'Assigned', remarks: 'Unused cart for return...' },
  ]
  return (
    <div className="space-y-6 mb-8">
      {/* First Row - Live Feed */}
      <div className="overflow-hidden h-[370px] flex items-center gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]">
        <ZoomableVideo label='Live - North Entrance' className='w-[60%] h-full'>
          <LiveFeed
            modelPath="/models/cleantrack/model.json"
            classes={COCO_CLASSES}
            filterClasses={['bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'brocolli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake']}
            displayAs="leftovers"
            performanceMode='balanced'
          />
        </ZoomableVideo>
        {/* Right Panel */}
        <div className="w-[40%] p-4 pr-2 flex flex-col">
          <div className="relative mb-5 flex items-center gap-1">
            <span className="text-muted text-xs">smart</span>
            <Shield className="w-3 h-3 text-muted" />
          </div>

          <div className="flex flex-col items-start gap-3 pr-8">
            {/* Dropdowns */}
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              {dropdownFields.map((field) => (
                <p key={field} className="text-[12px] font-medium text-[#A6A6A6] text-xs">
                  {field}
                  <span className="flex items-center justify-between mt-2 px-3 py-1 rounded-[15px] border-[1.5px] border-[#FFFFFF] text-[11px]">
                    Not Selected
                    <img src="dropdownIcon.svg" alt="dropdown icon" />
                  </span>
                </p>
              ))}
            </div>

            {/* Remarks */}
            <p className="text-[#A6A6A6] text-[12px] mt-4">Remarks</p>
            <textarea
              name="text-area"
              id="text-area"
              placeholder="Write your notes here..."
              className="w-full max-h-20 min-h-20 p-3 rounded-[15px] border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[12px] font-normal resize-none no-scrollbar"
            />

            {/* Actions */}
            <div className="flex gap-4 items-center w-full justify-end">
              <button className="w-[17px] h-[17px] rounded-full border-2 border-[#85A3FF] text-[#85A3FF] text-[15px] flex items-center justify-center font-medium cursor-pointer">
                <span className="-mt-1">+</span>
              </button>
              <button className="bg-[#85A3FF] rounded-[15px] px-4 p-1 text-xs font-semibold cursor-pointer">Submit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Key Monitored Places */}
      <div className="mb-4">
        <h2 className="text-foreground text-[16px] font-medium mb-4">Key Monitored Places</h2>
        <div className="grid grid-cols-5 gap-4">
          {monitoredPlaces.slice(0, 5).map((place, index) => (
            <div key={place.id} className="rounded-lg overflow-hidden min-h-[150px] flex flex-col relative">
              <div className="flex-1">
                <SimpleCameraFeed
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="w-full text-[#A6A6A6] text-[12px] font-medium py-1">
                {place.alt}
              </p>
              {index === 4 &&
                <div className="absolute inset-0 rounded-lg overflow-hidden flex flex-col items-center justify-center text-[32px]"> 8+
                </div>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Third Row - My Taskboard + Speed Dial */}
      <div className="grid grid-cols-12 gap-6 mt-10">
        {/* Taskboard */}
        <div className="col-span-7">
          <h2 className="text-foreground text-[16px] font-medium mb-4">My Taskboard</h2>
          <div className="relative rounded-lg p-6">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                opacity: 0.1,
              }}
            />
            <div className="relative space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-xs text-muted font-medium pb-3 border-b border-border">
                <div className="col-span-2">Area</div>
                <div className="col-span-2">Item</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-4">Remarks</div>
              </div>

              {/* Table Rows */}
              {tableRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 text-sm text-foreground items-center py-2">
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="radio" name="taskboard" defaultChecked={idx === 0} className="w-4 h-4 accent-foreground" />
                    <span className="text-xs">{row.area}</span>
                  </div>
                  <div className="col-span-2 text-xs">{row.item}</div>
                  <div className="col-span-2 text-xs">{row.category}</div>
                  <div className="col-span-2 text-xs">{row.status}</div>
                  <div className="col-span-4 text-xs text-muted">{row.remarks}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Speed Dial */}
        <div className="col-span-5 flex items-center mt-4">
          <SpeedDialCard />
        </div>
      </div>
    </div>
  )
}

export default CleanTrack
