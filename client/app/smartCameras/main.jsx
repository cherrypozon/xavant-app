'use client'
import React, {use, useEffect} from 'react';
import NavigationBar from '../components/NavigationBar/main';
import Header from '../components/Header/main';
import FilterBar from '@/app/components/FilterBar/main';
import Footer from '@/app/components/Footer/main';
import PeopleCounterView from './PeopleCounter/peopleCounterView';
import CleanTrack from './CleanTrack/cleanTrackView';
import SafeKeep from './SafeKeep/safeKeepView';
import SimpleCameraFeed from '@/app/components/LiveFeedCamera/noneDetectionCamera';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchSmartCamerasData } from '../store/thunks/smartCamerasThunks';
import { useFullyLoaded } from '../hooks/useFullyLoaded';
import SmartCamerasSkeleton from '../components/Skeleton/SmartCamerasSkeleton';
import PeopleCounterSkeleton from '../components/Skeleton/PeopleCounterSkeleton';
import CleanTrackSkeleton from '../components/Skeleton/CleanTrackSkeleton';
import SafeKeepSkeleton from '../components/Skeleton/SafeKeepSkeleton';

const SmartCameras = ({activeView, setActiveView}) => {  
  const dispatch = useAppDispatch();
  const { data, error } = useAppSelector((state) => state.smartCameras);
  const { isFullyLoaded } = useFullyLoaded('smartCameras');

  useEffect(() => {
    dispatch(fetchSmartCamerasData());
  }, [dispatch]);

  console.log("Smart Cameras data:", data);

  const renderContainerContent = () => {
    if (!isFullyLoaded) {
      switch (activeView) {
        case 'people-counter':
          return <PeopleCounterSkeleton />;
        case 'cleantrack':
          return <CleanTrackSkeleton />;
        case 'safekeep':
          return <SafeKeepSkeleton />;
        default:
          return <SmartCamerasSkeleton />;
      }
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-500">Error: {error}</div>
        </div>
      );
    }

    switch (activeView) {
      case 'people-counter':
        return <PeopleCounterView />
      case 'cleantrack':
        return <CleanTrack />
      case 'safekeep':
        return <SafeKeep />
      default:
        return (
          <div className="grid grid-cols-2 gap-6 mb-8">
            {["North Entrance", "South Entrance", "Main Hall", "Parking Lot"].map((card, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden min-h-[350px]"
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  // style={{
                  //   background:
                  //     'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
                  //   opacity: 0.1
                  // }}
                >
                  <SimpleCameraFeed/>
                </div>

                <div className="relative p-6">
                  <h3 className="text-foreground font-medium text-xs">
                    {card}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="relative p-10 w-full h-screen flex flex-col gap-3 overflow-y-scroll no-scrollbar">
      <Header activeView={activeView} />
      <NavigationBar activeView={activeView} onNavigate={setActiveView} />
      <FilterBar />
       <div className="flex-1">{renderContainerContent()}</div>
      <Footer />
    </div>
  )
}

export default SmartCameras
