"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { stages, meta } from "@/data/project";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 pt-4 sm:px-8">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3">
        <a href="#top" className="font-display text-lg tracking-tight text-bone">
          {meta.siteName}
        </a>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-full text-bone lg:hidden"
          >
            <Menu size={16} />
          </button>
          <div className="hidden items-center gap-1 lg:flex">
            <a
              href="#dataset"
              className="focus-ring rounded-full px-3 py-2 text-xs text-bone/60 transition hover:text-bone"
            >
              Dataset
            </a>
            <a
              href="#architecture"
              className="focus-ring rounded-full px-3 py-2 text-xs text-bone/60 transition hover:text-bone"
            >
              Architecture
            </a>
            <a
              href="#results"
              className="focus-ring rounded-full px-3 py-2 text-xs text-bone/60 transition hover:text-bone"
            >
              Results
            </a>
            <a
              href="#publication"
              className="focus-ring rounded-full px-3 py-2 text-xs text-bone/60 transition hover:text-bone"
            >
              Publication
            </a>
            <a
              href="#team"
              className="focus-ring rounded-full px-3 py-2 text-xs text-bone/60 transition hover:text-bone"
            >
              Team
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="font-display text-lg text-bone">{meta.siteName}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-full text-bone"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-1 px-6">
              {stages.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="focus-ring flex items-baseline gap-3 rounded-xl px-3 py-3 text-bone/80 transition hover:bg-bone/5 hover:text-bone"
                >
                  <span className="font-mono text-xs text-bone/35">{s.index}</span>
                  <span className="font-display text-xl">{s.title}</span>
                </motion.a>
              ))}
              <motion.a
                href="#publication"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stages.length * 0.03 }}
                className="focus-ring flex items-baseline gap-3 rounded-xl px-3 py-3 text-bone/80 transition hover:bg-bone/5 hover:text-bone"
              >
                <span className="font-mono text-xs text-bone/35">·</span>
                <span className="font-display text-xl">Publication</span>
              </motion.a>
              <motion.a
                href="#team"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (stages.length + 1) * 0.03 }}
                className="focus-ring flex items-baseline gap-3 rounded-xl px-3 py-3 text-bone/80 transition hover:bg-bone/5 hover:text-bone"
              >
                <span className="font-mono text-xs text-bone/35">·</span>
                <span className="font-display text-xl">Team</span>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
