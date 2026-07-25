"use client";

import Link from "next/link";
import { Stethoscope, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <Link href="/" className="flex items-center gap-2">
        <Stethoscope size={20} style={{ color: "var(--accent)" }} />
        <span className="font-medium text-[15px]">agentautopsy</span>
      </Link>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded-lg transition-all hover:scale-105"
        style={{ background: "var(--bg-elevated)" }}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </nav>
  );
}
