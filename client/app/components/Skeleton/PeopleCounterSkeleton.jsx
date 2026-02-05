'use client';

// Reusable skeleton pulse animation component
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-[#4B5672] rounded ${className}`} />
);

// Live Feed + Traffic Analytics Skeleton
const LiveFeedAnalyticsSkeleton = () => (
  <div className="overflow-hidden h-[370px] flex items-center gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]">
    {/* Left - Video Feed */}
    <div className="w-[40%] h-full p-2">
      <SkeletonPulse className="w-full h-full rounded-lg" />
    </div>
    
    {/* Right - Traffic Status + Graph */}
    <div className="w-[60%] py-4 pr-6">
      {/* Smart badge */}
      <div className="flex items-center gap-1 mb-5">
        <SkeletonPulse className="w-12 h-3" />
        <SkeletonPulse className="w-3 h-3 rounded" />
      </div>
      
      <div className="flex items-start gap-4">
        {/* Traffic Status + Predictions */}
        <div className="w-[45%] flex flex-col gap-4">
          {/* Traffic Status Card */}
          <div className="bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px] p-4">
            <SkeletonPulse className="w-24 h-4 mb-3" />
            <SkeletonPulse className="w-16 h-8 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <SkeletonPulse className="w-16 h-2" />
                  <SkeletonPulse className="w-12 h-4" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Predictions Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <SkeletonPulse className="w-20 h-3 mb-1" />
                {i % 2 === 0 && <SkeletonPulse className="w-full h-8" />}
              </div>
            ))}
          </div>
        </div>
        
        {/* Line Graph */}
        <div className="w-[55%] bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px] p-5">
          <SkeletonPulse className="w-32 h-4 mx-auto mb-4" />
          <SkeletonPulse className="w-full h-[220px] rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// Monitored Places Skeleton (5 columns)
const MonitoredPlacesSkeleton = () => (
  <div className="mb-4">
    <SkeletonPulse className="w-44 h-5 mb-4" />
    <div className="grid grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-lg overflow-hidden min-h-[150px] flex flex-col">
          <SkeletonPulse className="flex-1 w-full" />
          <SkeletonPulse className="w-20 h-3 mt-2" />
        </div>
      ))}
    </div>
  </div>
);

// Weekly Analytics Skeleton
const WeeklyAnalyticsSkeleton = () => (
  <div className="col-span-7">
    <SkeletonPulse className="w-44 h-5 mb-4" />
    <div className="bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-6">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonPulse className="w-20 h-3" />
            <SkeletonPulse className="w-16 h-6" />
          </div>
        ))}
      </div>
      
      {/* Top Areas */}
      <SkeletonPulse className="w-24 h-4 mb-3" />
      <div className="flex gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonPulse className="w-6 h-6 rounded-full" />
            <SkeletonPulse className="w-24 h-3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Speed Dial Skeleton
const SpeedDialSkeleton = () => (
  <div className="col-span-5 flex items-center">
    <div className="w-full h-[200px] bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-6">
      <SkeletonPulse className="w-32 h-5 mb-4" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonPulse className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <SkeletonPulse className="w-24 h-3" />
              <SkeletonPulse className="w-32 h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main PeopleCounter Skeleton Component
export default function PeopleCounterSkeleton() {
  return (
    <div className="space-y-6 mb-8">
      {/* First Row - Live Feed + Traffic Analytics */}
      <LiveFeedAnalyticsSkeleton />
      
      {/* Second Row - Key Monitored Places */}
      <MonitoredPlacesSkeleton />
      
      {/* Third Row - Weekly Data Analytics + Speed Dial */}
      <div className="grid grid-cols-12 gap-2 mt-10">
        <WeeklyAnalyticsSkeleton />
        <SpeedDialSkeleton />
      </div>
    </div>
  );
}
