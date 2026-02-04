"use client";

import { motion } from "motion/react";

export default function GesturesDemo() {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        Gestures
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        마우스/터치 제스처: hover, tap, drag
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Hover */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.3, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-lg cursor-pointer"
            />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Hover 효과
          </span>
        </div>

        {/* Tap */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
            <motion.div
              whileTap={{ scale: 0.8, borderRadius: "50%" }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg cursor-pointer"
            />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Tap/Click 효과
          </span>
        </div>

        {/* Drag */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
            <motion.div
              drag
              dragConstraints={{ left: -50, right: 50, top: -20, bottom: 20 }}
              dragElastic={0.2}
              whileDrag={{ scale: 1.1 }}
              className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg cursor-grab active:cursor-grabbing"
            />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            드래그 (제한)
          </span>
        </div>

        {/* Drag X only */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: -60, right: 60 }}
              dragSnapToOrigin
              whileDrag={{ scale: 1.1, backgroundColor: "#f59e0b" }}
              className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg cursor-grab active:cursor-grabbing"
            />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            X축 드래그 (스냅백)
          </span>
        </div>

        {/* Hover + Tap combo */}
        <div className="flex flex-col items-center gap-2 col-span-2">
          <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg cursor-pointer"
            >
              Interactive Button
            </motion.button>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Hover + Tap 조합
          </span>
        </div>
      </div>
    </div>
  );
}
