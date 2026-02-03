"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";

export default function BasicTweens() {
  const toBoxRef = useRef<HTMLDivElement>(null);
  const fromBoxRef = useRef<HTMLDivElement>(null);
  const fromToBoxRef = useRef<HTMLDivElement>(null);
  const propsBoxRef = useRef<HTMLDivElement>(null);

  const playTo = useCallback(() => {
    if (!toBoxRef.current) return;
    gsap.to(toBoxRef.current, {
      x: 150,
      duration: 0.8,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  }, []);

  const playFrom = useCallback(() => {
    if (!fromBoxRef.current) return;
    gsap.from(fromBoxRef.current, {
      x: 150,
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: "back.out(1.7)",
    });
  }, []);

  const playFromTo = useCallback(() => {
    if (!fromToBoxRef.current) return;
    gsap.fromTo(
      fromToBoxRef.current,
      { x: -50, rotation: -180, opacity: 0.3 },
      { x: 150, rotation: 180, opacity: 1, duration: 1, ease: "power2.inOut", yoyo: true, repeat: 1 }
    );
  }, []);

  const playProps = useCallback(() => {
    if (!propsBoxRef.current) return;
    const tl = gsap.timeline();
    tl.to(propsBoxRef.current, { x: 80, duration: 0.3, ease: "power1.out" })
      .to(propsBoxRef.current, { rotation: 360, duration: 0.5, ease: "power2.inOut" })
      .to(propsBoxRef.current, { scale: 1.5, duration: 0.3, ease: "back.out(2)" })
      .to(propsBoxRef.current, { scale: 1, x: 0, rotation: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        Basic Tweens
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        GSAP의 기본 트윈 메서드: to(), from(), fromTo()
      </p>

      <div className="space-y-6">
        {/* gsap.to() */}
        <div className="flex items-center gap-4">
          <button
            onClick={playTo}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            to()
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden">
            <div
              ref={toBoxRef}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* gsap.from() */}
        <div className="flex items-center gap-4">
          <button
            onClick={playFrom}
            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            from()
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden">
            <div
              ref={fromBoxRef}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* gsap.fromTo() */}
        <div className="flex items-center gap-4">
          <button
            onClick={playFromTo}
            className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap"
          >
            fromTo()
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden">
            <div
              ref={fromToBoxRef}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Multiple Properties */}
        <div className="flex items-center gap-4">
          <button
            onClick={playProps}
            className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
          >
            복합
          </button>
          <div className="flex-1 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg relative overflow-hidden">
            <div
              ref={propsBoxRef}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
