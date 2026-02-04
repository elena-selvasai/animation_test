"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function KeyframesDemo() {
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isPlaying3, setIsPlaying3] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        Keyframes
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        배열로 정의하는 키프레임 애니메이션
      </p>

      <div className="space-y-6">
        {/* Bounce */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsPlaying1(false);
              setTimeout(() => setIsPlaying1(true), 50);
            }}
            className="px-3 py-1.5 bg-cyan-500 text-white text-sm rounded-lg hover:bg-cyan-600 transition-colors whitespace-nowrap"
          >
            바운스
          </button>
          <div className="flex-1 h-16 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden flex items-end justify-center pb-2">
            <motion.div
              animate={
                isPlaying1
                  ? {
                      y: [0, -40, 0, -20, 0, -10, 0],
                      scaleY: [1, 0.9, 1.1, 0.95, 1.05, 0.98, 1],
                      scaleX: [1, 1.1, 0.9, 1.05, 0.95, 1.02, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full shadow-lg"
            />
          </div>
        </div>

        {/* Shake */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsPlaying2(false);
              setTimeout(() => setIsPlaying2(true), 50);
            }}
            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
          >
            흔들기
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden flex items-center justify-center">
            <motion.div
              animate={
                isPlaying2
                  ? {
                      x: [0, -15, 15, -10, 10, -5, 5, 0],
                      rotate: [0, -5, 5, -3, 3, -1, 1, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-500 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Pulse */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsPlaying3(false);
              setTimeout(() => setIsPlaying3(true), 50);
            }}
            className="px-3 py-1.5 bg-violet-500 text-white text-sm rounded-lg hover:bg-violet-600 transition-colors whitespace-nowrap"
          >
            펄스
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden flex items-center justify-center">
            <motion.div
              animate={
                isPlaying3
                  ? {
                      scale: [1, 1.3, 1, 1.2, 1, 1.1, 1],
                      opacity: [1, 0.7, 1, 0.8, 1, 0.9, 1],
                      borderRadius: ["20%", "50%", "20%", "40%", "20%", "30%", "20%"],
                    }
                  : {}
              }
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Continuous animation */}
        <div className="flex items-center gap-4">
          <span className="px-3 py-1.5 bg-zinc-300 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-sm rounded-lg whitespace-nowrap">
            무한
          </span>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden flex items-center justify-center gap-2">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
              className="w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.2,
                delay: 0.2,
              }}
              className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.2,
                delay: 0.4,
              }}
              className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
