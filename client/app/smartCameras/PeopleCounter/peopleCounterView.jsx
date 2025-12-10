'use client'
import React from 'react'
import SpeedDialCard from '@/app/components/SpeedDialCard/main'
import TrafficStatus from '@/app/components/TrafficStatus/main'
import LineGraph from '@/app/components/Graph/main'
import LiveFeed from '@/app/components/LiveFeedCamera/main'
import ZoomableVideo from '@/app/components/ZoomableVideo/main'
import { Shield } from 'lucide-react'
import { COCO_CLASSES } from '@/app/constants/modelClasses';
import SimpleCameraFeed from '@/app/components/LiveFeedCamera/noneDetectionCamera';

const PeopleCounterView = () => {
  const hourlyDetectionData = [
    { time: '4:00', count: 5 },
    { time: '6:00', count: 8 },
    { time: '8:00', count: 18 },
    { time: '10:00', count: 38 },
    { time: '12:00', count: 35 },
    { time: '14:00', count: 32 },
    { time: '16:00', count: 28 },
    { time: '18:00', count: 18 },
    { time: '20:00', count: 42 },
    { time: '22:00', count: 25 },
    { time: '0:00', count: 8 },
    { time: '2:00', count: 3 }
  ]

  const monitoredPlaces = [
    { id: 1, alt: '4F Hallway B' },
    { id: 2, alt: 'Indoor Pool' },
    { id: 3, alt: 'Main Reception' },
    { id: 4, alt: 'Outdoor Pool' },
    { id: 5, alt: 'More' }
  ]

  const topAreas = ['Outdoor Pool', 'North Entrance', 'Main Reception']

  return (
    <div className="space-y-6 mb-8">
      {/* First Row - Live Feed + Traffic Analytics */}
      <div className="overflow-hidden h-[370px] flex items-center gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]">
        <ZoomableVideo label='Live - North Entrance' className='w-[40%] h-full'>
          <LiveFeed
            modelPath="/models/people_counter/model.json"
            classes={COCO_CLASSES}
            filterClasses={['person']}
            performanceMode='performance'
          />
        </ZoomableVideo>

        {/* Right - Traffic Status + Graph */}
        <div className="w-[60%] py-4">
          <div className="relative mb-5 flex items-center gap-1">
            <span className="text-muted text-xs">smart</span>
            <Shield className="w-3 h-3 text-muted" />
          </div>

          <div className="flex items-start gap-4 pr-8">
            {/* Traffic Status + Predictions */}
            <div className="w-[45%] flex flex-col">
              <TrafficStatus
                currentTraffic={45}
                trafficStatus="Moderate"
                utilization="60%"
                peakTime="12:30"
                offPeakTime="09:15"
                avgTraffic="38"
              />
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-5">
                {[
                  { title: 'Prediction', desc: 'Based on past data, expected rush hour will occur at around 19:00.', icon: 'predectionIcon.svg' },
                  { title: 'Staffing', desc: 'Add one hotel personnel in the next 5mins', icon: 'staffingIcon.svg' }
                ].map((item) => (
                  <React.Fragment key={item.title}>
                    <p className="font-medium text-[12px] relative">{item.title} <img src={item.icon} alt={item.title} className="absolute" /></p>
                    <p className="font-normal text-[10px]">{item.desc}</p>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Line Graph */}
            <div className="w-[55%] bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px] pt-5">
              <p className="w-full text-center font-medium text-[12px] mb-4">Foot Traffic per day</p>
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

      {/* Third Row - Weekly Data Analytics + Speed Dial */}
      <div className="grid grid-cols-12 gap-2 mt-10">

        {/* Left - Analytics */}
        <div className="col-span-7">
          <h2 className="text-foreground text-[16px] font-medium mb-4">Weekly Data Analytics</h2>
          <div className="relative rounded-lg p-6">
            <div className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', opacity: 0.1 }} />

            <div className="relative grid grid-cols-3 gap-2">
              {/* Top 3 Areas */}
              <div className="space-y-3 mt-3">
                <h3 className="text-foreground font-medium text-sm mb-1">Top 3 Areas by Traffic</h3>
                <p className="text-muted text-[11px] mb-4">Weekly</p>
                {topAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <input type="radio" name="areas" defaultChecked={idx === 0} className="w-4 h-4 accent-foreground" />
                    <span className="text-foreground">{area}</span>
                  </div>
                ))}
              </div>

              {/* Outdoor Pool Details */}
              <div className="border border-gradient-to-r from-[#85A3FF] to-[#DCE1F2] rounded-[10px] p-4 col-span-2">
                <h4 className="text-foreground font-medium text-[12px] mb-3">Outdoor Pool</h4>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Overall Peak Time', values: ['9:15 - 11:30', 'Friday', 'Tuesday'], subLabels: ['Overall Peak Time', 'High traffic', 'Low traffic'] },
                    { label: 'Other Metrics', values: ['7:00 - 21:00', '2 Incidents', '4 Incidents'], subLabels: ['Operating Hours', 'Incident Reported', 'Reported Not Solved'] }
                  ].map((group, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-4 mt-4">
                      {group.values.map((val, i) => (
                        <div key={i}>
                          <div className="text-foreground font-medium text-sm">{val}</div>
                          <div className="text-muted text-[11px]">{group.subLabels[i]}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Speed Dial */}
        <div className="col-span-5 flex items-center mt-1.5">
          <SpeedDialCard />
        </div>

      </div>
    </div>
  )
}

export default PeopleCounterView