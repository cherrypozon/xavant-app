'use client';

import { useSelector, useDispatch } from 'react-redux';
import { setActiveView, toggleSidebar } from './store/slices/dashboardSlice';
import Dashboard from './dashboard/main.jsx';
import Sidebar from './components/SideBar/main.jsx';
import SmartCameras from './smartCameras/main.jsx';
import Emergency from './components/Emergency/main.jsx';
import Setting from './components/Setting/main.jsx';
import Profile from './components/Profile/main.jsx';

export default function Home() {
  const dispatch = useDispatch();
  const { activeView, sidebarCollapsed } = useSelector((state) => state.dashboard);

  const handleNavigate = (view) => {
    dispatch(setActiveView(view));
  };

  const handleToggleCollapse = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className="flex-1 overflow-auto">
        {activeView === 'dashboard' && <Dashboard />}
        {(activeView === 'smart-cameras' ||
          activeView === 'people-counter' ||
          activeView === 'safekeep' ||
          activeView === 'cleantrack') && (
            <SmartCameras
              activeView={activeView}
              setActiveView={handleNavigate}
            />
          )}
        {activeView === 'emergency' && <Emergency />}
        {activeView === 'profile' && <Profile />}
        {activeView === 'settings' && <Setting />}
      </div>
    </div>
  );
}
