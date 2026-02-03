"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";

export default function SvgAnimation() {
  const circleRef = useRef<SVGCircleElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const polygonRef = useRef<SVGPolygonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const playMorph = useCallback(() => {
    if (!circleRef.current) return;

    gsap
      .timeline()
      .to(circleRef.current, {
        attr: { cx: 150, cy: 60, r: 40 },
        fill: "#ec4899",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(circleRef.current, {
        attr: { cx: 60, cy: 60, r: 25 },
        fill: "#8b5cf6",
        duration: 0.5,
        ease: "power2.inOut",
      });
  }, []);

  const playRotateScale = useCallback(() => {
    if (!rectRef.current) return;

    gsap
      .timeline()
      .to(rectRef.current, {
        rotation: 360,
        scale: 1.5,
        fill: "#06b6d4",
        transformOrigin: "center center",
        duration: 0.6,
        ease: "power2.inOut",
      })
      .to(rectRef.current, {
        rotation: 0,
        scale: 1,
        fill: "#6366f1",
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
  }, []);

  const playPolygon = useCallback(() => {
    if (!polygonRef.current) return;

    gsap
      .timeline()
      .to(polygonRef.current, {
        attr: { points: "60,10 110,50 90,100 30,100 10,50" },
        fill: "#f59e0b",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(polygonRef.current, {
        attr: { points: "60,20 100,40 100,80 60,100 20,80 20,40" },
        fill: "#10b981",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(polygonRef.current, {
        attr: { points: "60,10 90,35 90,75 60,100 30,75 30,35" },
        fill: "#ef4444",
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
  }, []);

  const playPath = useCallback(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        SVG 애니메이션
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        SVG 도형의 속성, 변형, 경로 애니메이션
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Circle Morph */}
        <div className="flex flex-col items-center">
          <svg
            width="120"
            height="80"
            className="bg-zinc-100 dark:bg-zinc-700 rounded-lg mb-2"
          >
            <circle
              ref={circleRef}
              cx="60"
              cy="40"
              r="25"
              fill="#8b5cf6"
            />
          </svg>
          <button
            onClick={playMorph}
            className="px-3 py-1 bg-violet-500 text-white text-xs rounded-lg hover:bg-violet-600 transition-colors"
          >
            모핑
          </button>
        </div>

        {/* Rect Rotate & Scale */}
        <div className="flex flex-col items-center">
          <svg
            width="120"
            height="80"
            className="bg-zinc-100 dark:bg-zinc-700 rounded-lg mb-2"
          >
            <rect
              ref={rectRef}
              x="40"
              y="20"
              width="40"
              height="40"
              rx="6"
              fill="#6366f1"
            />
          </svg>
          <button
            onClick={playRotateScale}
            className="px-3 py-1 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors"
          >
            회전+확대
          </button>
        </div>

        {/* Polygon Transform */}
        <div className="flex flex-col items-center">
          <svg
            width="120"
            height="80"
            className="bg-zinc-100 dark:bg-zinc-700 rounded-lg mb-2"
            viewBox="0 0 120 110"
          >
            <polygon
              ref={polygonRef}
              points="60,10 90,35 90,75 60,100 30,75 30,35"
              fill="#ef4444"
            />
          </svg>
          <button
            onClick={playPolygon}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
          >
            다각형 변형
          </button>
        </div>

        {/* Path Drawing */}
        <div className="flex flex-col items-center">
          <svg
            width="120"
            height="80"
            className="bg-zinc-100 dark:bg-zinc-700 rounded-lg mb-2"
            viewBox="0 0 120 80"
          >
            <path
              ref={pathRef}
              d="M10,40 Q30,10 60,40 T110,40"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <button
            onClick={playPath}
            className="px-3 py-1 bg-teal-500 text-white text-xs rounded-lg hover:bg-teal-600 transition-colors"
          >
            경로 그리기
          </button>
        </div>
      </div>
    </div>
  );
}
