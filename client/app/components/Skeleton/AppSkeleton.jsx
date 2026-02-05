'use client';

// Reusable skeleton pulse animation component
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-[#4B5672] rounded ${className}`} />
);

// Sidebar Skeleton
const SidebarSkeleton = () => (
  <div className="w-[80px] h-screen bg-[#1a1f2e] flex flex-col items-center py-6 gap-6">
    {/* Logo */}
    <SkeletonPulse className="w-10 h-10 rounded-lg" />
    
    {/* Nav items */}
    <div className="flex flex-col gap-4 mt-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonPulse key={i} className="w-10 h-10 rounded-lg" />
      ))}
    </div>
    
    {/* Bottom items */}
    <div className="mt-auto flex flex-col gap-4">
      <SkeletonPulse className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

// Content Area Skeleton
const ContentSkeleton = () => (
  <div className="flex-1 p-10 bg-background">
    {/* Header area */}
    <div className="flex justify-between items-center mb-8">
      <SkeletonPulse className="w-48 h-8" />
      <div className="flex gap-4">
        <SkeletonPulse className="w-10 h-10 rounded-full" />
        <SkeletonPulse className="w-10 h-10 rounded-full" />
      </div>
    </div>
    
    {/* Main content area */}
    <div className="flex gap-5">
      <SkeletonPulse className="w-1/3 h-40 rounded-[10px]" />
      <SkeletonPulse className="w-1/3 h-40 rounded-[10px]" />
      <SkeletonPulse className="w-1/3 h-40 rounded-[10px]" />
    </div>
  </div>
);

// Main App Skeleton for rehydration loading
export default function AppSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarSkeleton />
      <ContentSkeleton />
    </div>
  );
}
