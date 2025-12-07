'use client';
import React from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function Notification({ open, onClose, message }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-[#3b455b] rounded-2xl shadow-xl p-6 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#A6A6A6] mb-4 text-sm font-normal">{message}</p>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-[#4B5672] text-white font-medium transition cursor-pointer text-sm"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
