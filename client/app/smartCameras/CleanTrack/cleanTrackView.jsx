'use client'
import React from 'react'
import SpeedDialCard from '@/app/components/SpeedDialCard/main'

const CleanTrack = () => {
  return (
    <div className="space-y-6 mb-8">
      {/* First Row - Large Empty Card */}
      <div className="relative rounded-lg overflow-hidden min-h-[400px]">
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
            opacity: 0.1,
          }}
        ></div>
        <div className="relative p-6">{/* Content placeholder */}</div>
      </div>

      {/* Second Row - Key Monitored Places */}
      <div>
        <h2 className="text-foreground text-lg font-medium mb-4">Key Monitored Places</h2>
        <div className="grid grid-cols-5 gap-4">
          {Array(4)
            .fill('')
            .map((_, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden min-h-[150px]">
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                    opacity: 0.1,
                  }}
                ></div>
                <div className="relative p-4">{/* Content placeholder */}</div>
              </div>
            ))}

          {/* Card 5 - 8+ More */}
          <div className="relative rounded-lg overflow-hidden min-h-[150px] flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
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

      {/* Third Row - My Taskboard + Speed Dial */}
      <div className="grid grid-cols-12 gap-6">
        {/* My Taskboard Section - spans 7 columns */}
        <div className="col-span-7">
          <h2 className="text-foreground text-lg font-medium mb-4">My Taskboard</h2>
          <div className="relative rounded-lg p-6">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                opacity: 0.1,
              }}
            ></div>
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
              {[
                { area: 'North Hall B', item: 'Towels', category: 'Urgent', status: 'Assigned', remarks: 'Multiple towels and some...' },
                { area: 'Indoor Pool', item: 'Wet floor', category: 'Non-Urgent', status: 'Assigned', remarks: 'Wet floor, accident risk' },
                { area: 'Elevator Hall A', item: 'Bellman cart', category: 'Non-Urgent', status: 'Assigned', remarks: 'Unused cart for return...' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 text-sm text-foreground items-center py-2">
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="radio" name="taskboard" defaultChecked={idx === 0} className="w-4 h-4 accent-foreground" />
                    <span>{row.area}</span>
                  </div>
                  <div className="col-span-2">{row.item}</div>
                  <div className="col-span-2">{row.category}</div>
                  <div className="col-span-2">{row.status}</div>
                  <div className="col-span-4 text-muted">{row.remarks}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Speed Dial Component */}
        <div className="col-span-5 flex items-center mt-4">
          <SpeedDialCard />
        </div>
      </div>
    </div>
  )
}

export default CleanTrack
