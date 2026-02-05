'use client';

// Reusable skeleton pulse animation component
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-[#4B5672] rounded ${className}`} />
);

// Skeleton for camera feed cards (2x2 grid)
const CameraGridSkeleton = () => (
  <div className="grid grid-cols-2 gap-6 mb-8">
    {[1, 2, 3, 4].map((idx) => (
      <div key={idx} className="relative rounded-lg overflow-hidden min-h-[350px] bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)]">
        <SkeletonPulse className="absolute inset-0" />
        <div className="relative p-6">
          <SkeletonPulse className="w-28 h-4" />
        </div>
      </div>
    ))}
  </div>
);

// Main SmartCameras Skeleton Component
export default function SmartCamerasSkeleton() {
  return <CameraGridSkeleton />;
}
