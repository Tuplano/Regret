"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-[1200px] h-[700px] max-w-[95vw] max-h-[90vh] bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-gray-300 hover:text-white text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
