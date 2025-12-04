'use client'
import React from 'react'
import LineGraph from '@/app/components/Graph/main'
import ProgressBar from '@/app/components/Progressbar/main'
import AreaActivityReport from '@/app/components/AreaActivityReport/main'
import AlertsList from '@/app/components/ActiveAlert/main'
import LiveFeed from '@/app/components/LiveFeedCamera/main'

const Body = () => {
    const events = [
        { time: '12:00 PM', text: 'Check-out period completes' },
        { time: '10:00 AM', text: 'Housekeeping begins daily room cleaning' },
        { time: '9:15 AM', text: 'Front desk processes early check-ins' },
        { time: '8:30 AM', text: 'Guest arrivals begin' }
    ]

    const hourlyDetectionData = [
        { time: '4:00', count: 5 }, { time: '6:00', count: 8 }, { time: '8:00', count: 18 },
        { time: '10:00', count: 38 }, { time: '12:00', count: 35 }, { time: '14:00', count: 32 },
        { time: '16:00', count: 28 }, { time: '18:00', count: 18 }, { time: '20:00', count: 42 },
        { time: '22:00', count: 25 }, { time: '0:00', count: 8 }, { time: '2:00', count: 3 }
    ]

    const zones = [
        { label: 'Indoor Pool', percent: 20 }, { label: 'Outdoor Pool', percent: 35 },
        { label: 'Lobby', percent: 11 }, { label: 'North Entrance', percent: 10 },
        { label: 'Hall Way', percent: 6 }, { label: 'Elevator', percent: 11 }, { label: 'Stairway', percent: 7 }
    ]

    const areaData = [
        { area: 'Indoor Pool', current: 293, previous: 488, change: -41.2, peak: '13:00', duration: '15 min' },
        { area: 'Outdoor Pool', current: 145, previous: 342, change: -57.6, peak: '12:00', duration: '22 min' },
        { area: 'Lobby', current: 450, previous: 272, change: 65.4, peak: '10:00', duration: '23 min' },
        { area: 'North Entrance', current: 305, previous: 421, change: -27.6, peak: '14:00', duration: '14 min' },
        { area: 'Hallway', current: 291, previous: 137, change: 112.4, peak: '8:00', duration: '8 min' },
        { area: 'Elevator', current: 133, previous: 372, change: -64.2, peak: '18:00', duration: '18 min' },
        { area: 'Stairway', current: 368, previous: 214, change: 72, peak: '10:00', duration: '12 min' }
    ]

    const activeAlerts = [
        { title: 'Unattended Item at North Hallway B', item: 'Bag', time: '9:15', status: 'Not assigned' },
        { title: 'Towels and Garbage at North Hallway B', item: 'Towels', category: 'Urgent', status: 'Assigned' },
        { title: 'Wetfloor at Indoor Pool area', item: 'Wetfloor', category: 'Non-urgent', status: 'Assigned' },
        { title: 'Heavy foot traffic at North Entrance' },
        { title: 'Heavy foot traffic at Outdoor Pool' }
    ]

    const cameras = [
        { name: 'North Entrance', status: 'Online' },
        { name: 'Main Reception', status: 'Online' },
        { name: 'Hallway', status: 'Online' },
        { name: 'Indoor Pool', status: 'Offline' }
    ]

    // Component to render each camera feed
    const CameraCard = ({ name, status }) => (
        <div className='h-[188px] rounded-[10px] relative'>
            <LiveFeed />
            <div className='absolute top-3 flex justify-between items-center w-full px-2'>
                <p className='font-medium text-[10px]'>{name}</p>
                <div
                    className={`rounded-[10px] px-2 py-1 font-semibold text-[8px] ${status === 'Online' ? 'bg-[#00FF40A6]' : 'bg-[#FF3737]'
                        }`}
                >
                    {status}
                </div>
            </div>
        </div>
    )

    return (
        <div>
            {/* Top body section */}
            <div className='flex justify-between items-start gap-5'>
                {/* Security Overview */}
                <div className='p-5 h-40 w-1/3 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]'>
                    <div className='flex items-center gap-2'>
                        <img src='shield.svg' alt='shield' className='w-[35px] h-[35px]' />
                        <h1 className='flex flex-col font-semibold text-[17px] text-[#8BA7FF]'>
                            Security Overview
                            <span className='text-[10px] opacity-80 font-normal text-white'>
                                Real-time security monitoring
                            </span>
                        </h1>
                    </div>
                    <div className='ml-[37px] mt-3 flex items-center gap-2.5'>
                        <div className='bg-[#10B981] w-2 h-2 rounded-full'></div>
                        <h2 className='font-medium text-xs text-[#10B981]'>All Systems Normal</h2>
                    </div>
                    <div className='w-[280px] h-0.5 bg-[#979797] opacity-40 ml-3 mt-5'></div>
                    <div className='flex items-center mt-3 ml-[37px] gap-6'>
                        <h1 className='font-semibold text-[19px] text-white flex items-center gap-2'>
                            8
                            <span className='text-[10px] opacity-80 font-normal text-white'>Cameras Online</span>
                        </h1>
                        <h1 className='font-semibold text-[19px] text-white flex items-center gap-2'>
                            12
                            <span className='text-[10px] opacity-80 font-normal text-white'>Zones Secured</span>
                        </h1>
                    </div>
                </div>

                {/* Event Timeline */}
                <div className='p-5 h-53 w-1/3 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]'>
                    <div className='flex items-center gap-2'>
                        <img src='timeline-clock.svg' alt='timeline-clock' className='w-[35px] h-[37px]' />
                        <h1 className='flex flex-col font-semibold text-[17px] text-[#DE27EFB3]'>
                            Event Timeline
                            <span className='text-[10px] opacity-80 font-normal text-white'>
                                Last 24 hours activity
                            </span>
                        </h1>
                    </div>
                    <div className='relative ml-[37px] mt-3'>
                        <div className='absolute left-[7px] top-2.5 bottom-2.5 w-1 bg-linear-to-b from-[#DE27EF] to-[#8B4FD9] opacity-70'></div>
                        {events.map((e, i) => (
                            <div key={i} className='relative mb-2 flex items-center ml-6'>
                                <div className='absolute left-[-19px] top-1 w-2 h-2 bg-[#DE27EF] rounded-full opacity-70'></div>
                                <h2 className='text-[10px] font-normal opacity-90 mb-1'>
                                    {e.time} <span>{e.text}</span>
                                </h2>
                            </div>
                        ))}
                    </div>
                    <div className='font-medium mb-3 text-xs text-[#DE27EF] opacity-70 hover:opacity-100 cursor-pointer'>
                        View all events →
                    </div>
                </div>

                {/* System Health */}
                <div className='p-5 h-40 w-1/3 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]'>
                    <div className='flex items-center gap-2'>
                        <img src='heart.svg' alt='heart' className='w-[35px] h-[35px]' />
                        <h1 className='flex flex-col font-semibold text-[17px] text-[#14AE5C]'>
                            System Health
                            <span className='text-[10px] opacity-80 font-normal text-white'>Performance & alerts</span>
                        </h1>
                    </div>
                    <div className='ml-[37px] mt-3 flex flex-col gap-2'>
                        {[
                            { icon: 'videoIcon.svg', label: 'Camera', statusIcon: 'checkIcon.svg' },
                            { icon: 'storageIcon.svg', label: 'Storage', extra: '75% Used' },
                            { icon: 'wifiIcon.svg', label: 'Network', statusIcon: 'checkIcon.svg' }
                        ].map((item, idx) => (
                            <div key={idx} className='flex items-center gap-15 ml-1.5'>
                                <img src={item.icon} alt={item.label} />
                                <h2 className='font-semibold text-[10px] text-[#FFFFFFB3]'>{item.label}</h2>
                                {item.extra && <h2 className='font-semibold text-[10px] text-[#FFFFFFB3]'>{item.extra}</h2>}
                                {item.statusIcon && <img src={item.statusIcon} alt='check Icon' className={item.label === 'Network' ? 'ml-[-3px]' : ''} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Insights Center & Activity */}
            <div className='w-full mt-3 flex gap-5'>
                <div className='w-[65%]'>
                    <h1 className='-mt-7 mb-3 font-medium text-[16px]'>Insights Center</h1>

                    {/* Insight Cards */}
                    <div className='flex gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-5'>
                        {/* Hourly Motion */}
                        <div className='w-1/2 flex justify-between items-center p-5 bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px]'>
                            <div className='flex flex-col gap-5 w-full'>
                                <div className='flex items-center gap-2'>
                                    <img src='heartbeat.svg' alt='beat' />
                                    <h1 className='flex flex-col font-semibold text-[17px]'>
                                        Hourly Motion <span className='text-[10px] opacity-80 font-normal -mt-1'>Detection Count</span>
                                    </h1>
                                </div>
                                <LineGraph data={hourlyDetectionData} xKey='time' yKey='count' color='#85A3FF' height={240} />
                            </div>
                        </div>

                        {/* Peak Foot Traffic */}
                        <div className='w-1/2 flex flex-col gap-3 bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px] p-5'>
                            <div className='flex items-center gap-2'>
                                <img src='users.svg' alt='beat' />
                                <h1 className='flex flex-col font-semibold text-[17px]'>
                                    Peak Foot - Traffic Zones <span className='text-[10px] opacity-80 font-normal -mt-1'>Number of People in the Area</span>
                                </h1>
                            </div>
                            <div className='flex flex-col gap-1'>
                                {zones.map(z => (
                                    <div className='flex' key={z.label}>
                                        <div className='flex justify-between text-[11px] font-medium w-full'>
                                            <span>{z.label}</span>
                                        </div>
                                        <ProgressBar percent={z.percent} />
                                    </div>
                                ))}
                            </div>
                            {/* Traffic Highlights */}
                            <div className='grid grid-cols-2 grid-rows-2 gap-2'>
                                <div className='bg-[#56658c] px-4 py-2 rounded-[10px] flex flex-col gap-1'>
                                    <div className='flex items-center gap-1'>
                                        <img src='alert.svg' alt='alert' />
                                        <p className='font-normal text-[9px]'>Busiest Zone</p>
                                    </div>
                                    <p className='font-normal text-[9px] flex justify-between'>
                                        Outdoor Pool <span className='text-[#14AE5C] font-bold text-[8px]'>35 % Traffic</span>
                                    </p>
                                </div>
                                <div className='bg-[#56658c] px-4 py-2 rounded-[10px] flex flex-col gap-1'>
                                    <div className='flex items-center gap-1'>
                                        <img src='blueAlert.svg' alt='alert' />
                                        <p className='font-normal text-[9px]'>Quietest Zone </p>
                                    </div>
                                    <p className='font-normal text-[9px] flex justify-between'>
                                        Hallway <span className='text-[#14AE5C] font-bold text-[8px]'>6 % Traffic</span>
                                    </p>
                                </div>
                                <div className='col-span-2 row-start-2 bg-[#56658c] px-4 py-2 rounded-[10px] flex flex-col gap-1'>
                                    <div className='flex items-center gap-1'>
                                        <img src='trend.svg' alt='alert' />
                                        <p className='font-normal text-[9px]'>High Traffic Areas - More than 20 % traffic</p>
                                    </div>
                                    <p className='font-normal text-[9px] flex justify-between'>
                                        2 Zones above average <span className='text-[#14AE5C] font-bold text-[8px]'>Indoor Pool, Outdoor Pool</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Area Report */}
                    <div className='mt-5'>
                        <p className='font-medium text-[16px] mb-3'>Area Activity Report</p>
                        <div className='bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-5'>
                            <div className='flex justify-between items-center mb-2'>
                                <div className='flex items-center gap-2'>
                                    <img src='mapPin.svg' alt='pin' />
                                    <h1 className='flex flex-col font-semibold text-[17px]'>
                                        Area Activity Report <span className='text-[10px] opacity-80 font-normal -mt-1'>7-day comparison & analytics</span>
                                    </h1>
                                </div>
                                <div className='bg-[#4B5672] py-1 px-3 rounded-[10px] font-medium text-[12px] cursor-pointer'>
                                    Refresh All Data
                                </div>
                            </div>
                            <AreaActivityReport data={areaData} />
                        </div>
                    </div>
                </div>

                {/* Active Alerts & Live Feeds */}
                <div className='w-[35%] flex flex-col gap-4'>
                    <h1 className='mt-4 font-medium text-[15px]'>Active Alerts (5)</h1>
                    <div className='w-full -mt-2'>
                        <div className='w-full bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-4'>
                            <AlertsList alerts={activeAlerts} />
                        </div>
                    </div>

                    {/* Live Camera Grid */}
                    <div className='w-full max-h-[500px] bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-4 grid grid-cols-2 grid-rows-2 gap-3'>
                        {cameras.map((c, i) => (
                            <CameraCard key={i} {...c} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Body
