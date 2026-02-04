"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

export default function TimelineDemo() {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!box1Ref.current || !box2Ref.current || !box3Ref.current) return;

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        setProgress(tl.progress() * 100);
      },
      onComplete: () => {
        setIsPlaying(false);
      },
    });

    // Sequential animations
    tl.to(box1Ref.current, {
      x: 200,
      duration: 0.5,
      ease: "power2.out",
    })
      .to(box2Ref.current, {
        x: 200,
        rotation: 360,
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(box3Ref.current, {
        x: 200,
        scale: 1.3,
        duration: 0.5,
        ease: "back.out(1.7)",
      })
      // Parallel animations (all back together)
      .to(
        [box1Ref.current, box2Ref.current, box3Ref.current],
        {
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.1,
        }
      );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const play = useCallback(() => {
    if (!timelineRef.current) return;
    timelineRef.current.restart();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (!timelineRef.current) return;
    timelineRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (!timelineRef.current) return;
    timelineRef.current.play();
    setIsPlaying(true);
  }, []);

  const reverse = useCallback(() => {
    if (!timelineRef.current) return;
    timelineRef.current.reverse();
    setIsPlaying(true);
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        Timeline 애니메이션
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        순차적 및 병렬 애니메이션을 타임라인으로 제어
      </p>

      {/* Animation area */}
      <div className="h-32 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden mb-4">
        <div
          ref={box1Ref}
          className="absolute left-4 top-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded shadow-md"
        />
        <div
          ref={box2Ref}
          className="absolute left-4 top-12 w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded shadow-md"
        />
        <div
          ref={box3Ref}
          className="absolute left-4 top-22 w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded shadow-md"
        />
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          <span>진행률</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={play}
          className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
        >
          재생
        </button>
        <button
          onClick={isPlaying ? pause : resume}
          className="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
        >
          {isPlaying ? "일시정지" : "계속"}
        </button>
        <button
          onClick={reverse}
          className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          역재생
        </button>
      </div>
    </div>
  );
}
