"use client";

import { useRef, useCallback, useState } from "react";
import { gsap } from "gsap";

type StaggerFrom = "start" | "center" | "edges" | "random" | "end";

const staggerPatterns: { name: string; from: StaggerFrom }[] = [
  { name: "처음부터", from: "start" },
  { name: "중앙에서", from: "center" },
  { name: "가장자리", from: "edges" },
  { name: "랜덤", from: "random" },
  { name: "끝에서", from: "end" },
];

export default function StaggerDemo() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activePattern, setActivePattern] = useState<StaggerFrom>("start");

  const playStagger = useCallback((from: StaggerFrom) => {
    if (!gridRef.current) return;
    const boxes = gridRef.current.querySelectorAll(".stagger-box");
    
    setActivePattern(from);

    gsap.fromTo(
      boxes,
      {
        scale: 0,
        opacity: 0,
        rotation: -180,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: {
          each: 0.05,
          from: from,
          grid: [4, 6],
        },
      }
    );
  }, []);

  const resetGrid = useCallback(() => {
    if (!gridRef.current) return;
    const boxes = gridRef.current.querySelectorAll(".stagger-box");
    gsap.set(boxes, { scale: 1, opacity: 1, rotation: 0 });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        Stagger 애니메이션
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        여러 요소를 순차적으로 애니메이션. 패턴: <span className="font-mono text-indigo-500">{activePattern}</span>
      </p>

      {/* Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-6 gap-2 mb-6 p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="stagger-box w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-md shadow-sm"
          />
        ))}
      </div>

      {/* Pattern buttons */}
      <div className="flex gap-2 flex-wrap">
        {staggerPatterns.map((pattern) => (
          <button
            key={pattern.from}
            onClick={() => playStagger(pattern.from)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activePattern === pattern.from
                ? "bg-teal-500 text-white"
                : "bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-500"
            }`}
          >
            {pattern.name}
          </button>
        ))}
        <button
          onClick={resetGrid}
          className="px-3 py-1.5 bg-zinc-400 text-white text-sm rounded-lg hover:bg-zinc-500 transition-colors"
        >
          리셋
        </button>
      </div>
    </div>
  );
}
