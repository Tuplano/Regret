"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm animate-fadeIn px-3 overflow-y-auto">
      <div className="relative my-8 w-[95vw] max-w-[1200px] bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden md:rounded-3xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 text-gray-300 hover:text-white text-2xl p-1"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Content area */}
        <div className="w-full h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
