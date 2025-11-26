import React from "react";

const TrafficStatus = ({
  currentTraffic = 0,
  trafficStatus = "Light",
  utilization = "0%",
  peakTime = "--:--",
  offPeakTime = "--:--",
  avgTraffic = "--",
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-2 text-white w-full max-w-xs">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">{currentTraffic}</div>
        <div className="text-sm font-normal mt-1">Current Traffic</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-[10px] text-white/70 mt-1">
          Traffic: {trafficStatus}
        </div>
        <div className="text-[10px] text-white/70">
        
          Utilization: {utilization}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-3"></div>

      {/* Data Today */}
      <div className="text-[12px] font-medium mb-2">Data today</div>

      <div className="flex justify-between font-normal text-[12px]">
        <span>{peakTime}</span>
        <span className="text-white/70">Peak Time</span>
      </div>

      <div className="flex justify-between font-normal text-[12px] mt-1">
        <span>{offPeakTime}</span>
        <span className="text-white/70">Off-Peak Time</span>
      </div>

      <div className="flex justify-between font-normal text-[12px] mt-1">
        <span>{avgTraffic}</span>
        <p className="text-white/70">Avg Traffic <span className="text-[9px] block">24-hr cycle</span></p>
      </div>
    </div>
  );
};

export default TrafficStatus;
