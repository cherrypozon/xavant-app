import React from 'react';
import { Search, Plus } from 'lucide-react';

const FilterBar = () => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'key-monitored', label: 'Key Monitored Places' },
    { id: 'ground-floor', label: 'Ground Floor' },
    { id: 'hallways', label: 'Hallways' },
    { id: 'recreational', label: 'Recreational Areas' }
  ];

  return (
    <div className="flex items-center justify-between py-2">
      {/* Left side - Filter tabs */}
      <div className="flex items-center gap-3">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`px-4 py-1.5 rounded-full font-medium text-[12px] item-center cursor-pointer ${
              index === 1
                ? 'bg-active text-black'
                : 'bg-white text-black hover:bg-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-active text-active hover:bg-active/10 cursor-pointer">
          <Search className="w-4 h-4" />
          <span className="text-[12px]">Search Places</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-active text-active hover:bg-active/10 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span className="text-[12px]">Add Places</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
