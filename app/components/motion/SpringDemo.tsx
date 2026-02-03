"use client";

import { useState } from "react";
import { motion } from "motion/react";

const springConfigs = [
  { name: "Gentle", stiffness: 100, damping: 20, color: "from-sky-400 to-blue-500" },
  { name: "Bouncy", stiffness: 400, damping: 10, color: "from-lime-400 to-green-500" },
  { name: "Stiff", stiffness: 700, damping: 30, color: "from-orange-400 to-red-500" },
  { name: "Slow", stiffness: 50, damping: 15, color: "from-purple-400 to-indigo-500" },
];

export default function SpringDemo() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeStates, setActiveStates] = useState<boolean[]>([false, false, false, false]);

  const playAll = () => {
    setIsAnimating((prev) => !prev);
  };

  const playSingle = (index: number) => {
    setActiveStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          Spring Physics
        </h3>
        <button
          onClick={playAll}
          className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
        >
          전체 재생
        </button>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        스프링 물리 기반 애니메이션 (stiffness, damping)
      </p>

      <div className="space-y-4">
        {springConfigs.map((config, index) => (
          <div key={config.name} className="flex items-center gap-3">
            <button
              onClick={() => playSingle(index)}
              className="text-xs text-zinc-500 dark:text-zinc-400 w-16 font-mono text-left hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              {config.name}
            </button>
            <div className="flex-1 h-10 bg-zinc-100 dark:bg-zinc-700 rounded relative overflow-hidden">
              <motion.div
                animate={{
                  x: isAnimating || activeStates[index] ? 180 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: config.stiffness,
                  damping: config.damping,
                }}
                className={`absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br ${config.color} rounded-lg shadow-sm`}
              />
            </div>
            <div className="text-[10px] text-zinc-400 w-20 text-right">
              <div>stiff: {config.stiffness}</div>
              <div>damp: {config.damping}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Spring */}
      <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 text-center">
          드래그해서 스프링 반응 확인
        </p>
        <div className="flex justify-center">
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.5}
            whileDrag={{ scale: 1.2 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="w-16 h-16 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-2xl shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center"
          >
            <span className="text-white text-2xl">🎯</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
