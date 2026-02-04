"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function BasicAnimations() {
  const [isAnimating1, setIsAnimating1] = useState(false);
  const [isAnimating2, setIsAnimating2] = useState(false);
  const [isAnimating3, setIsAnimating3] = useState(false);
  const [isAnimating4, setIsAnimating4] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        Basic Animations
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Motion의 기본 애니메이션: animate, initial, transition
      </p>

      <div className="space-y-6">
        {/* Position */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAnimating1(!isAnimating1)}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            이동
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden">
            <motion.div
              animate={{ x: isAnimating1 ? 150 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Scale */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAnimating2(!isAnimating2)}
            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            확대
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden flex items-center justify-center">
            <motion.div
              animate={{ scale: isAnimating2 ? 1.8 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Rotate */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAnimating3(!isAnimating3)}
            className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap"
          >
            회전
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden flex items-center justify-center">
            <motion.div
              animate={{ rotate: isAnimating3 ? 360 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Opacity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAnimating4(!isAnimating4)}
            className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
          >
            투명도
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden flex items-center justify-center">
            <motion.div
              animate={{ opacity: isAnimating4 ? 0.2 : 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
