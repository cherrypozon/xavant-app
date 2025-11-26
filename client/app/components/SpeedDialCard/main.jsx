import React from 'react';
import { Phone } from 'lucide-react';

const SpeedDialCard = () => {
  return (
    <div className="rounded-lg ml-4 py-2 h-full w-full ">
      {/* Background overlay */}
      <div className="inset-0 rounded-lg"></div>

      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Left Column - Speed Dial */}
        <div className="flex flex-col justify-start">
          <h3 className="text-foreground text-[16px] font-medium mb-4">Speed Dial</h3>
          <div className="space-y-6 text-sm">
            {['Attendant/ Guest Care', 'Security Personnel', 'Housekeeping', 'Maintenance'].map((role, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-normal text-sm">{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Emergency */}
        <div
          className="flex flex-col items-center justify-center text-center rounded-lg p-6"
          style={{ backgroundColor: '#6489FA' }}
        >
          <div className="text-6xl mb-3 text-white">✱</div>
          <div className="text-[16px] font-medium mb-2 text-white">Emergency</div>
          <div className="text-[10px] text-white opacity-80">
            Press only in case of Emergency
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedDialCard;
