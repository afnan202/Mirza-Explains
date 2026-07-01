"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    document.documentElement.classList.toggle("dark", !next);
    try {
      localStorage.setItem("mirza-theme", next ? "light" : "dark");
    } catch (e) {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-full text-bone transition hover:scale-105 active:scale-95"
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
