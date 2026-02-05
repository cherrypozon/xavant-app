'use client';

// Reusable skeleton pulse animation component
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-[#4B5672] rounded ${className}`} />
);

// Live Feed Section Skeleton
const LiveFeedSkeleton = () => (
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
      
      {/* Dropdowns grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonPulse className="w-16 h-3" />
            <SkeletonPulse className="w-full h-8 rounded-[15px]" />
          </div>
        ))}
      </div>
      
      {/* Remarks */}
      <div className="flex flex-col gap-2 mt-2">
        <SkeletonPulse className="w-16 h-3" />
        <SkeletonPulse className="w-full h-20 rounded-[15px]" />
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 items-center justify-end">
        <SkeletonPulse className="w-5 h-5 rounded-full" />
        <SkeletonPulse className="w-16 h-7 rounded-[15px]" />
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

// Taskboard Skeleton
const TaskboardSkeleton = () => (
  <div className="col-span-7">
    <SkeletonPulse className="w-32 h-5 mb-4" />
    <div className="relative rounded-lg p-6 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)]">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border">
        <SkeletonPulse className="col-span-2 h-4" />
        <SkeletonPulse className="col-span-2 h-4" />
        <SkeletonPulse className="col-span-2 h-4" />
        <SkeletonPulse className="col-span-2 h-4" />
        <SkeletonPulse className="col-span-4 h-4" />
      </div>
      
      {/* Table Rows */}
      {[1, 2, 3].map((row) => (
        <div key={row} className="grid grid-cols-12 gap-4 py-3">
          <div className="col-span-2 flex items-center gap-2">
            <SkeletonPulse className="w-4 h-4 rounded-full" />
            <SkeletonPulse className="w-16 h-3" />
          </div>
          <SkeletonPulse className="col-span-2 h-3" />
          <SkeletonPulse className="col-span-2 h-3" />
          <SkeletonPulse className="col-span-2 h-3" />
          <SkeletonPulse className="col-span-4 h-3" />
        </div>
      ))}
    </div>
  </div>
);

// Speed Dial Skeleton
const SpeedDialSkeleton = () => (
  <div className="col-span-5 flex items-center mt-4">
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

// Main CleanTrack Skeleton Component
export default function CleanTrackSkeleton() {
  return (
    <div className="space-y-6 mb-8">
      {/* First Row - Live Feed */}
      <LiveFeedSkeleton />
      
      {/* Second Row - Key Monitored Places */}
      <MonitoredPlacesSkeleton />
      
      {/* Third Row - My Taskboard + Speed Dial */}
      <div className="grid grid-cols-12 gap-6 mt-10">
        <TaskboardSkeleton />
        <SpeedDialSkeleton />
      </div>
    </div>
  );
}
