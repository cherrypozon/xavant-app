'use client';

// Reusable skeleton pulse animation component
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-[#4B5672] rounded ${className}`} />
);

// Skeleton for the top cards section
const TopCardSkeleton = () => (
  <div className='p-5 h-40 w-1/3 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]'>
    <div className='flex items-center gap-2'>
      <SkeletonPulse className='w-[35px] h-[35px] rounded-full' />
      <div className='flex flex-col gap-1'>
        <SkeletonPulse className='w-32 h-4' />
        <SkeletonPulse className='w-24 h-2' />
      </div>
    </div>
    <div className='ml-[37px] mt-3'>
      <SkeletonPulse className='w-28 h-3' />
    </div>
    <div className='w-[280px] h-0.5 bg-[#979797] opacity-40 ml-3 mt-5' />
    <div className='flex items-center mt-3 ml-[37px] gap-6'>
      <SkeletonPulse className='w-24 h-5' />
      <SkeletonPulse className='w-24 h-5' />
    </div>
  </div>
);

// Skeleton for event timeline
const TimelineSkeleton = () => (
  <div className='p-5 h-53 w-1/3 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px]'>
    <div className='flex items-center gap-2'>
      <SkeletonPulse className='w-[35px] h-[37px] rounded-full' />
      <div className='flex flex-col gap-1'>
        <SkeletonPulse className='w-28 h-4' />
        <SkeletonPulse className='w-24 h-2' />
      </div>
    </div>
    <div className='ml-[37px] mt-3 flex flex-col gap-2'>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className='flex items-center gap-2'>
          <SkeletonPulse className='w-2 h-2 rounded-full' />
          <SkeletonPulse className='w-48 h-3' />
        </div>
      ))}
    </div>
    <SkeletonPulse className='w-24 h-3 mt-3 ml-[37px]' />
  </div>
);

// Skeleton for insight cards
const InsightCardSkeleton = () => (
  <div className='w-1/2 p-5 bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px]'>
    <div className='flex items-center gap-2 mb-4'>
      <SkeletonPulse className='w-6 h-6 rounded' />
      <div className='flex flex-col gap-1'>
        <SkeletonPulse className='w-28 h-4' />
        <SkeletonPulse className='w-20 h-2' />
      </div>
    </div>
    <SkeletonPulse className='w-full h-[240px] rounded-lg' />
  </div>
);

// Skeleton for progress bars section
const ProgressBarsSkeleton = () => (
  <div className='w-1/2 flex flex-col gap-3 bg-[linear-gradient(0deg,#85A3FF4D,#DCE1F24D)] rounded-[10px] p-5'>
    <div className='flex items-center gap-2'>
      <SkeletonPulse className='w-6 h-6 rounded' />
      <div className='flex flex-col gap-1'>
        <SkeletonPulse className='w-36 h-4' />
        <SkeletonPulse className='w-28 h-2' />
      </div>
    </div>
    <div className='flex flex-col gap-2'>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className='flex items-center gap-2'>
          <SkeletonPulse className='w-20 h-3' />
          <SkeletonPulse className='flex-1 h-2 rounded-full' />
        </div>
      ))}
    </div>
    <div className='grid grid-cols-2 grid-rows-2 gap-2 mt-2'>
      <SkeletonPulse className='h-14 rounded-[10px]' />
      <SkeletonPulse className='h-14 rounded-[10px]' />
      <SkeletonPulse className='col-span-2 h-14 rounded-[10px]' />
    </div>
  </div>
);

// Skeleton for area activity report table
const TableSkeleton = () => (
  <div className='mt-5'>
    <SkeletonPulse className='w-40 h-5 mb-3' />
    <div className='bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-5'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-2'>
          <SkeletonPulse className='w-6 h-6 rounded' />
          <div className='flex flex-col gap-1'>
            <SkeletonPulse className='w-36 h-4' />
            <SkeletonPulse className='w-28 h-2' />
          </div>
        </div>
        <SkeletonPulse className='w-28 h-8 rounded-[10px]' />
      </div>
      {/* Table header */}
      <div className='flex gap-4 mb-2'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonPulse key={i} className='flex-1 h-4' />
        ))}
      </div>
      {/* Table rows */}
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className='flex gap-4 mb-3'>
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <SkeletonPulse key={col} className='flex-1 h-6' />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for alerts list
const AlertsSkeleton = () => (
  <div className='w-full bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-4'>
    {[1, 2, 3].map((i) => (
      <div key={i} className='flex items-center gap-3 mb-3 p-2'>
        <SkeletonPulse className='w-10 h-10 rounded-full' />
        <div className='flex-1'>
          <SkeletonPulse className='w-32 h-4 mb-1' />
          <SkeletonPulse className='w-48 h-3' />
        </div>
        <SkeletonPulse className='w-16 h-6 rounded-full' />
      </div>
    ))}
  </div>
);

// Skeleton for camera feeds
const CameraFeedsSkeleton = () => (
  <div className='w-full max-h-[500px] bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-4 grid grid-cols-2 grid-rows-2 gap-3'>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className='h-[188px] rounded-[10px] relative overflow-hidden'>
        <SkeletonPulse className='w-full h-full' />
        <div className='absolute top-3 flex justify-between items-center w-full px-2'>
          <SkeletonPulse className='w-20 h-3' />
          <SkeletonPulse className='w-12 h-5 rounded-[10px]' />
        </div>
      </div>
    ))}
  </div>
);

// Main Dashboard Skeleton Component
export default function DashboardSkeleton() {
  return (
    <div>
      {/* Top body section */}
      <div className='flex justify-between items-start gap-5'>
        <TopCardSkeleton />
        <TimelineSkeleton />
        <TopCardSkeleton />
      </div>

      {/* Insights Center & Activity */}
      <div className='w-full mt-3 flex gap-5'>
        <div className='w-[65%]'>
          <SkeletonPulse className='w-32 h-5 -mt-7 mb-3' />

          {/* Insight Cards */}
          <div className='flex gap-4 bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)] rounded-[10px] p-5'>
            <InsightCardSkeleton />
            <ProgressBarsSkeleton />
          </div>

          {/* Activity Area Report */}
          <TableSkeleton />
        </div>

        {/* Active Alerts & Live Feeds */}
        <div className='w-[35%] flex flex-col gap-4'>
          <SkeletonPulse className='w-32 h-5 mt-4' />
          <AlertsSkeleton />
          <CameraFeedsSkeleton />
        </div>
      </div>
    </div>
  );
}
