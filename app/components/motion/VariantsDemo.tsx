"use client";

import { useState } from "react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const cardVariants = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const colors = [
  "from-rose-400 to-pink-500",
  "from-orange-400 to-amber-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-violet-400 to-purple-500",
  "from-fuchsia-400 to-pink-500",
];

export default function VariantsDemo() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleAnimation = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          Variants
        </h3>
        <button
          onClick={toggleAnimation}
          className="px-4 py-2 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-colors"
        >
          재생
        </button>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Variants로 복잡한 애니메이션 상태 관리
      </p>

      {/* Stagger Children Demo */}
      <div className="bg-zinc-100 dark:bg-zinc-700 rounded-lg p-4 mb-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-6 gap-2"
        >
          {colors.map((color, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`h-10 bg-gradient-to-br ${color} rounded-lg`}
            />
          ))}
        </motion.div>
      </div>

      {/* Card with variants */}
      <div className="flex gap-3 justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className={`w-16 h-20 bg-gradient-to-br ${colors[i]} rounded-xl cursor-pointer flex items-center justify-center`}
          >
            <span className="text-white font-bold text-lg">{i + 1}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
