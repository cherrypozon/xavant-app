'use client'
import React from 'react'
import SpeedDialCard from '@/app/components/SpeedDialCard/main'

const SafeKeep = () => {
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

      {/* Second Row - 6 Cards + Speed Dial */}
      <div className="grid grid-cols-12 gap-6 justify-center items-center">
        {/* Left Side - 6 Cards */}
        <div className="col-span-7">
          <h2 className="text-foreground text-lg font-medium mb-4">Key Monitored Places</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              '4F Hallway B',
              'Indoor Pool',
              'Main Reception',
              'Outdoor Pool',
              'North Entrance',
            ].map((place, idx) => (
              <div key={idx}>
                <div className="relative rounded-lg overflow-hidden min-h-[150px]">
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                      opacity: 0.1,
                    }}
                  ></div>
                  <div className="relative p-4">{/* Content placeholder */}</div>
                </div>
                <div className="text-foreground text-sm mt-2">{place}</div>
              </div>
            ))}

            {/* Card 6 - More */}
            <div className="relative rounded-lg overflow-hidden h-[150px] flex items-center justify-center">
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

        {/* Right Side - Speed Dial Component */}
        <div className="col-span-5 -mt-10 -ml-3 pr-5">
          <SpeedDialCard />
        </div>
      </div>
    </div>
  )
}

export default SafeKeep
