'use client';

import { useState } from 'react';
import Dashboard from './dashboard/main.jsx';
import Sidebar from './components/SideBar/main.jsx';
import SmartCameras from './smartCameras/main.jsx';
import Emergency from './components/Emergency/main.jsx';
import Setting from './components/Setting/main.jsx';
import Profile from './components/Profile/main.jsx';

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-auto">
        {activeView === 'dashboard' && <Dashboard />}
        {(activeView === 'smart-cameras' ||
          activeView === 'people-counter' ||
          activeView === 'safekeep' ||
          activeView === 'cleantrack') && (
            <SmartCameras
              activeView={activeView}
              setActiveView={setActiveView}
            />
          )}
        {activeView === 'emergency' && <Emergency />}
        {activeView === 'profile' && <Profile />}
        {activeView === 'settings' && <Setting />}
      </div>
    </div>
  );
}
