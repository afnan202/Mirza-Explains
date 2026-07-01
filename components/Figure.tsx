"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

export default function Figure({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group relative">
        {children}
        <button
          onClick={() => setOpen(true)}
          aria-label="View fullscreen"
          className="focus-ring glass absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-bone/70 opacity-0 transition group-hover:opacity-100 hover:text-bone"
        >
          <Maximize2 size={14} />
        </button>
        {caption && (
          <p className="mt-3 text-center text-xs text-bone/40">{caption}</p>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/90 p-6 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close fullscreen"
                className="focus-ring glass absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full text-bone"
              >
                <X size={16} />
              </button>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
