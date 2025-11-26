"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div
      onClick={toggleTheme}
      className={`
        w-9 h-5 rounded-full border flex items-center px-0.5 cursor-pointer
        transition-colors duration-300
        ${isDark ? "bg-[linear-gradient(0deg,#85A3FF1A,#DCE1F21A)]" : "bg-gray-300"}
        ${isDark ? "border-[#FFFFFF]" : "border-[#1F2432]"}
      `}
    >
      <div
        className={`
          relative w-4 h-4 bg-white rounded-full shadow
          flex items-center justify-center
          transform transition-all duration-300
          ${isDark ? "translate-x-4" : "translate-x-0"}
        `}
      >
        <Sun
          size={10}
          className={`absolute transition-opacity duration-200 ${
            isDark ? "opacity-0" : "opacity-100 text-yellow-500"
          }`}
        />

        <Moon
          size={10}
          className={`absolute transition-opacity duration-200 ${
            isDark ? "opacity-100 text-[#3B5BFF]" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

export default ThemeSwitch;
