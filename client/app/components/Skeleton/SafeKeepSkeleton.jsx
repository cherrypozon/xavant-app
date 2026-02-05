'use client';

// Reusable skeleton pulse animation component
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-[#4B5672] rounded ${className}`} />
);

// Live Feed + Alert Panel Skeleton
const LiveFeedAlertSkeleton = () => (
  <div className="overflow-hidden h-[370px] flex items-center gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]">
    {/* Left - Video Feed */}
    <div className="w-[60%] h-full p-2">
      <SkeletonPulse className="w-full h-full rounded-lg" />
    </div>
    
    {/* Right Panel */}
    <div className="w-[40%] p-4 pr-6 flex flex-col gap-4">
      {/* Smart badge */}
      <div className="flex items-center gap-1">
        <SkeletonPulse className="w-12 h-3" />
        <SkeletonPulse className="w-3 h-3 rounded" />
      </div>
      
      {/* Alert header */}
      <div className="flex items-center gap-3">
        <SkeletonPulse className="w-6 h-6 rounded" />
        <SkeletonPulse className="w-40 h-4" />
      </div>
      
      {/* Item details row */}
      <div className="flex justify-between items-center">
        <SkeletonPulse className="w-20 h-4" />
        <SkeletonPulse className="w-20 h-4" />
        <SkeletonPulse className="w-32 h-8 rounded-[15px]" />
      </div>
      
      {/* Smart Sensing info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <SkeletonPulse className="w-24 h-3" />
          <SkeletonPulse className="w-4 h-4" />
        </div>
        <SkeletonPulse className="col-span-2 h-10" />
      </div>
      
      {/* Notes */}
      <div className="flex flex-col gap-2">
        <SkeletonPulse className="w-12 h-3" />
        <SkeletonPulse className="w-full h-[100px] rounded-lg" />
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 items-center justify-end">
        <SkeletonPulse className="w-5 h-5 rounded-full" />
        <SkeletonPulse className="w-16 h-7 rounded-[15px]" />
      </div>
    </div>
  </div>
);

// Monitored Places + Speed Dial Skeleton (3x2 grid + dial)
const MonitoredPlacesSpeedDialSkeleton = () => (
  <div className="grid grid-cols-12 gap-6 justify-center items-center">
    {/* Left Side - 6 Cards */}
    <div className="col-span-7">
      <SkeletonPulse className="w-44 h-5 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col">
            <div className="relative rounded-lg overflow-hidden h-[150px]">
              <SkeletonPulse className="w-full h-full" />
            </div>
            <SkeletonPulse className="w-20 h-3 mt-2 ml-1" />
          </div>
        ))}
      </div>
    </div>
    
    {/* Right Side - Speed Dial */}
    <div className="col-span-5 -mt-10 pr-5">
      <div className="w-full h-[250px] bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-6">
        <SkeletonPulse className="w-32 h-5 mb-4" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
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
  </div>
);

// Main SafeKeep Skeleton Component
export default function SafeKeepSkeleton() {
  return (
    <div className="space-y-6 mb-8">
      {/* First Row - Live Feed + Alert Panel */}
      <LiveFeedAlertSkeleton />
      
      {/* Second Row - Monitored Places + Speed Dial */}
      <MonitoredPlacesSpeedDialSkeleton />
    </div>
  );
}
