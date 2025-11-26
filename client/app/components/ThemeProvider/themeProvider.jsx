"use client";

import { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={isDark ? "dark" : "light"}>
      <div className="absolute top-4 right-6 z-50">
        <ThemeSwitch onToggle={setIsDark} />
      </div>

      {children}
    </div>
  );
}
