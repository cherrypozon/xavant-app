'use client';
import React, {useState} from 'react';
import BellWithBadge from './bellWithBadgeIcon';
import ThemeSwitch from './themeSwitch';
import Recording from '../Recording/main';

const Header = ({activeView}) => {
  const now = new Date();
  const [showModal, setShowModal] = useState(false);

  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  };

  const formattedDate = now.toLocaleString('en-US', options).replace(',', '');
  const handleThemeToggle = (isDark) => {
    console.log("Dark Mode:", isDark);
    // Example: document.documentElement.classList.toggle("dark", isDark);
  }
  const toggleModal = () => {
    setShowModal((prev) => !prev); // Toggle modal visibility
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="flex flex-col font-medium text-[16px]">
        {formattedDate} PHT
        <span className='font-normal text-[10px] text-[#FFFFFF59]'>
          Date & Time Today
        </span>
      </h1>

      <div className="flex gap-2 h-full items-center">
        {(activeView === "smart-cameras" || activeView === "people-counter" || activeView === "safekeep" || activeView === "cleantrack") && (
          <div className='flex gap-2 items-center py-[0.8px] px-2 border-[1.6px] border-white rounded-[10px] cursor-pointer' onClick={toggleModal}>
            <div className='bg-[#FF3737] w-3 h-3 rounded-full'></div>
            <p className='font-medium text-[10px]'>REC</p>
          </div>
        )}

        {/* <ThemeSwitch onToggle={handleThemeToggle} /> */}
        <BellWithBadge count={3} />
      </div>
        {showModal && (
        <div className="absolute top-28.5 right-10 w-[30.4%] z-20">
          <Recording onClose={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
};

export default Header;
