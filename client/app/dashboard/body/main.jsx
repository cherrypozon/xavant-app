'use client'
import React from 'react';
import LineGraph from '@/app/components/Graph/main';
import ProgressBar from '@/app/components/Progressbar/main';
import AreaActivityReport from '@/app/components/AreaActivityReport/main';
import AlertsList from '@/app/components/ActiveAlert/main';
import SimpleCameraFeed from '@/app/components/LiveFeedCamera/noneDetectionCamera';

const Body = ({ data }) => {
    if (!data || !data.dashboard) {
        return;
    }

    const { 
        security_overview, 
        event_timeline, 
        system_health, 
        insights, 
        alerts, 
        area_activity_report, 
        camera_feeds 
    } = data.dashboard;

    const events = event_timeline.events.map(e => ({
        time: e.time,
        text: e.description
    })).reverse();

    const hourlyDetectionData = insights.hourly_motion.map(item => ({
        time: item.hour,
        count: item.count
    }));

    const zones = insights.peak_foot_traffic_zones.map(zone => ({
        label: zone.zone,
        percent: zone.percentage
    }));

    const areaData = area_activity_report.areas.map(area => ({
        area: area.area,
        current: area.current_visits,
        previous: area.previous_visits,
        change: area.change_percent,
        peak: area.peak_hour,
        duration: `${area.average_duration_minutes} min`
    }));

    const activeAlerts = alerts.items.map(alert => ({
        title: alert.title,
        item: alert.item,
        time: alert.time,
        status: alert.status === 'not_assigned' ? 'Not assigned' : 
                alert.status === 'assigned' ? 'Assigned' : 
                alert.status,
        category: alert.severity === 'urgent' ? 'Urgent' : 
                  alert.severity === 'non_urgent' ? 'Non-urgent' : 
                  undefined
    }));

    // Transform camera feeds data
    const cameras = camera_feeds.map(cam => ({
        name: cam.location,
        status: cam.status === 'online' ? 'Online' : 'Offline'
    }));

    // Component to render each camera feed
    const CameraCard = ({ name, status }) => (
        <div className='h-[188px] rounded-[10px] relative'>
            {status === 'Online' ? (
                <SimpleCameraFeed />
            ) : (
                <div className="w-full h-full bg-[#2F3545] flex items-center justify-center">
                    <img
                        src="sample4.png"
                        alt="offline"
                        className="w-full h-full opacity-40 object-cover"
                    />
                </div>
            )}
            <div className='absolute top-3 flex justify-between items-center w-full px-2'>
                <p className='font-medium text-[10px]'>{name}</p>
                <div
                    className={`rounded-[10px] px-2 py-1 font-semibold text-[8px] ${
                        status === 'Online' ? 'bg-[#00FF40A6]' : 'bg-[#FF3737]'
                    }`}
                >
                    {status}
                </div>
            </div>
        </div>
    );

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
                        <h2 className='font-medium text-xs text-[#10B981]'>
                            {security_overview.system_status === 'normal' ? 'All Systems Normal' : security_overview.system_status}
                        </h2>
                    </div>
                    <div className='w-[280px] h-0.5 bg-[#979797] opacity-40 ml-3 mt-5'></div>
                    <div className='flex items-center mt-3 ml-[37px] gap-6'>
                        <h1 className='font-semibold text-[19px] text-white flex items-center gap-2'>
                            {security_overview.online_cameras}
                            <span className='text-[10px] opacity-80 font-normal text-white'>Cameras Online</span>
                        </h1>
                        <h1 className='font-semibold text-[19px] text-white flex items-center gap-2'>
                            {security_overview.zones_secured}
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
                        <div className='flex items-center gap-15 ml-1.5'>
                            <img src='videoIcon.svg' alt='Camera' />
                            <h2 className='font-semibold text-[10px] text-[#FFFFFFB3]'>Camera</h2>
                            {system_health.camera === 'ok' && <img src='checkIcon.svg' alt='check Icon' />}
                        </div>
                        <div className='flex items-center gap-15 ml-1.5'>
                            <img src='storageIcon.svg' alt='Storage' />
                            <h2 className='font-semibold text-[10px] text-[#FFFFFFB3]'>Storage</h2>
                            <h2 className='font-semibold text-[10px] text-[#FFFFFFB3]'>{system_health.storage.usage_percent}% Used</h2>
                        </div>
                        <div className='flex items-center gap-15 ml-1.5'>
                            <img src='wifiIcon.svg' alt='Network' />
                            <h2 className='font-semibold text-[10px] text-[#FFFFFFB3]'>Network</h2>
                            {system_health.network === 'ok' && <img src='checkIcon.svg' alt='check Icon' className='ml-[-3px]' />}
                        </div>
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
                                        {insights.busiest_zone.zone} <span className='text-[#14AE5C] font-bold text-[8px]'>{insights.busiest_zone.traffic_percent}% Traffic</span>
                                    </p>
                                </div>
                                <div className='bg-[#56658c] px-4 py-2 rounded-[10px] flex flex-col gap-1'>
                                    <div className='flex items-center gap-1'>
                                        <img src='blueAlert.svg' alt='alert' />
                                        <p className='font-normal text-[9px]'>Quietest Zone </p>
                                    </div>
                                    <p className='font-normal text-[9px] flex justify-between'>
                                        {insights.quietest_zone.zone} <span className='text-[#14AE5C] font-bold text-[8px]'>{insights.quietest_zone.traffic_percent}% Traffic</span>
                                    </p>
                                </div>
                                <div className='col-span-2 row-start-2 bg-[#56658c] px-4 py-2 rounded-[10px] flex flex-col gap-1'>
                                    <div className='flex items-center gap-1'>
                                        <img src='trend.svg' alt='alert' />
                                        <p className='font-normal text-[9px]'>High Traffic Areas - More than 20% traffic</p>
                                    </div>
                                    <p className='font-normal text-[9px] flex justify-between'>
                                        2 Zones above average <span className='text-[#14AE5C] font-bold text-[8px]'>Indoor Pool, Outdoor Pool</span>
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
                    <h1 className='mt-4 font-medium text-[15px]'>Active Alerts ({alerts.active_count})</h1>
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

export default Body;