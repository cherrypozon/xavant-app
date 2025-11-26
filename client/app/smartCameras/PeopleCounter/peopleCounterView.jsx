'use client'
import React from 'react'
import SpeedDialCard from '@/app/components/SpeedDialCard/main'
import TrafficStatus from '@/app/components/TrafficStatus/main';
import LineGraph from '@/app/components/Graph/main';
import { Shield } from 'lucide-react';

const PeopleCounterView = () => {
  const hourlyDetectionData = [
    { time: "4:00", count: 5 },
    { time: "6:00", count: 8 },
    { time: "8:00", count: 18 },
    { time: "10:00", count: 38 },
    { time: "12:00", count: 35 },
    { time: "14:00", count: 32 },
    { time: "16:00", count: 28 },
    { time: "18:00", count: 18 },
    { time: "20:00", count: 42 },
    { time: "22:00", count: 25 },
    { time: "0:00", count: 8 },
    { time: "2:00", count: 3 }
  ];
  return (
    <div>
      <div className="space-y-6 mb-8">
        {/* First Row - Large Empty Card */}
        <div className="overflow-hidden h-[370px] flex items-center gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]">
          <div className="w-[40%] relative h-full">
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full">
              <div className='w-2 h-2 rounded-full bg-[#00FF40] mt-0.5'></div>
              <p className='text-[12px] font-medium'>Live <span className='ml-5'>North Entrance</span></p>
            </div>
            <div className='absolute top-4 right-4 cursor-pointer'><img src="zoomOut.svg" alt="zoom out" /></div>

            {/* change this image path when actual integration of camera feed is happening */}
            <img src="sampleImage1.png" alt="North Entrance" className='h-full'/>

          </div>
          <div className="w-[60%] py-4">
            <div className="relative mb-5 flex items-center gap-1">
              <span className="text-muted text-xs">smart</span>
              <Shield className="w-3 h-3 text-muted" />
            </div>
            <div className="flex items-start gap-4 pr-8">
              <div className='w-[45%] flex flex-col'>
                <TrafficStatus
                  currentTraffic={45}
                  trafficStatus="Moderate"
                  utilization="60%"
                  peakTime="12:30"
                  offPeakTime="09:15"
                  avgTraffic="38"
                />
                <div className='grid grid-cols-2 grid-rows-2 gap-4 mt-5'>
                  <p className='font-medium text-[12px]'>Prediction <span className='absolute'><img src="predectionIcon.svg" alt="predection" /></span></p>
                  <p className='font-normal text-[10px]'>Based on past data, expected rush hour will occur at around 19:00. </p>
                  <p className="font-medium text-[12px]">Staffing <span className='absolute'><img src="staffingIcon.svg" alt="" /></span></p>
                  <p className='font-normal text-[10px]'>Add one hotel personnel in the next 5mins</p>
                </div>
              </div>
              <div className='w-[55%] bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px] pt-5'>
                <p className='w-full text-center font-medium text-[12px] mb-4'>Foot Traffic per day</p>
                <LineGraph
                  data={hourlyDetectionData}
                  xKey="time"
                  yKey="count"
                  color="#85A3FF"
                  height={250}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Key Monitored Places */}
        <div>
          <h2 className="text-foreground text-[16px] font-medium mb-4">Key Monitored Places</h2>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden min-h-[150px]">
                <div
                  className=""
                >

                </div>
                <div className="relative p-4">{/* Content will be added later */}</div>
              </div>
            ))}

            {/* Card 5 - 8+ More */}
            <div className="relative rounded-lg overflow-hidden min-h-[150px]">
              <div
                className=""

              ></div>
              <div className="relative p-4 flex flex-col items-center justify-center h-full">
                <div className="text-4xl font-light text-foreground mb-2">8+</div>
                <div className="text-sm text-muted">More</div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row - Weekly Data Analytics + Speed Dial + Emergency */}
        <div className="grid grid-cols-12 gap-2">
          {/* Weekly Data Analytics Section */}
          <div className="col-span-7">
            <h2 className="text-foreground text-[16px] font-medium mb-4">Weekly Data Analytics</h2>
            <div className="relative rounded-lg p-6">
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                  opacity: 0.1
                }}
              ></div>
              <div className="relative">
                <div className="grid grid-cols-3 gap-2">
                  {/* Left Side - Location List */}
                  <div className="space-y-3 mt-3">
                    <h3 className="text-foreground font-medium text-sm mb-1">Top 3 Areas by Traffic</h3>
                    <p className="text-muted text-[11px] mb-4">Weekly</p>

                    {['Outdoor Pool', 'North Entrance', 'Main Reception'].map((place, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <input
                          type="radio"
                          name="areas"
                          defaultChecked={idx === 0}
                          className="w-4 h-4 accent-foreground"
                        />
                        <span className="text-foreground">{place}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right Side - Outdoor Pool Details */}
                  <div className="border border-gradient-to-r from-[#85A3FF] to-[#DCE1F2] rounded-[10px] p-4 col-span-2">
                    <h4 className="text-foreground font-medium text-[12px] mb-3">Outdoor Pool</h4>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-foreground font-medium text-[16px]">9:15 - 11:30</div>
                          <div className="text-muted text-[11px]">Overall Peak Time</div>
                        </div>
                        <div>
                          <div className="text-foreground font-medium text-[16px]">Friday</div>
                          <div className="text-muted text-[11px]">High traffic</div>
                        </div>
                        <div>
                          <div className="text-foreground font-medium text-[16px]">Tuesday</div>
                          <div className="text-muted text-[11px]">Low traffic</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="text-foreground font-medium text-[16px]">7:00 - 21:00</div>
                          <div className="text-muted text-[11px]">Operating Hours</div>
                        </div>
                        <div>
                          <div className="text-foreground font-medium text-[16px]">2 Incidents</div>
                          <div className="text-muted text-[11px]">Incident Reported</div>
                        </div>
                        <div>
                          <div className="text-foreground font-medium text-[16px]">4 Incidents</div>
                          <div className="text-muted text-[11px]">Reported Not Solved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Speed Dial + Emergency */}
          <div className="col-span-5 flex items-center mt-1.5">
            <SpeedDialCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeopleCounterView
