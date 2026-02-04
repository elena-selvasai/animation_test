"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";

const easings = [
  { name: "linear", ease: "none", color: "from-gray-400 to-gray-600" },
  { name: "power1.out", ease: "power1.out", color: "from-blue-400 to-blue-600" },
  { name: "power2.out", ease: "power2.out", color: "from-cyan-400 to-cyan-600" },
  { name: "power3.out", ease: "power3.out", color: "from-teal-400 to-teal-600" },
  { name: "power4.out", ease: "power4.out", color: "from-green-400 to-green-600" },
  { name: "back.out", ease: "back.out(1.7)", color: "from-yellow-400 to-yellow-600" },
  { name: "elastic.out", ease: "elastic.out(1, 0.3)", color: "from-orange-400 to-orange-600" },
  { name: "bounce.out", ease: "bounce.out", color: "from-red-400 to-red-600" },
];

export default function EasingDemo() {
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const playAll = useCallback(() => {
    boxRefs.current.forEach((box, index) => {
      if (!box) return;
      gsap.fromTo(
        box,
        { x: 0 },
        {
          x: 180,
          duration: 1.5,
          ease: easings[index].ease,
          yoyo: true,
          repeat: 1,
        }
      );
    });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          Easing 비교
        </h3>
        <button
          onClick={playAll}
          className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
        >
          재생
        </button>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        다양한 이징 함수가 애니메이션에 미치는 영향을 비교해보세요
      </p>

      <div className="space-y-3">
        {easings.map((easing, index) => (
          <div key={easing.name} className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 w-24 font-mono truncate">
              {easing.name}
            </span>
            <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-700 rounded relative overflow-hidden">
              <div
                ref={(el) => { boxRefs.current[index] = el; }}
                className={`absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br ${easing.color} rounded shadow-sm`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
