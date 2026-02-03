"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";

export default function TextAnimation() {
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  // Split text into spans on mount
  useEffect(() => {
    const splitText = (element: HTMLElement | null, text: string) => {
      if (!element) return;
      element.innerHTML = text
        .split("")
        .map((char) =>
          char === " "
            ? '<span class="char inline-block">&nbsp;</span>'
            : `<span class="char inline-block">${char}</span>`
        )
        .join("");
    };

    splitText(text1Ref.current, "GSAP Animation");
    splitText(text2Ref.current, "글자별 효과");
    splitText(text3Ref.current, "Wave Effect");
  }, []);

  const playFadeIn = useCallback(() => {
    if (!text1Ref.current) return;
    const chars = text1Ref.current.querySelectorAll(".char");
    
    gsap.fromTo(
      chars,
      { opacity: 0, y: 50, rotationX: -90 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.03,
      }
    );
  }, []);

  const playScatter = useCallback(() => {
    if (!text2Ref.current) return;
    const chars = text2Ref.current.querySelectorAll(".char");

    gsap
      .timeline()
      .to(chars, {
        x: () => gsap.utils.random(-100, 100),
        y: () => gsap.utils.random(-50, 50),
        rotation: () => gsap.utils.random(-180, 180),
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.02,
      })
      .to(chars, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.03,
      });
  }, []);

  const playWave = useCallback(() => {
    if (!text3Ref.current) return;
    const chars = text3Ref.current.querySelectorAll(".char");

    gsap.to(chars, {
      y: -20,
      duration: 0.3,
      ease: "power2.out",
      stagger: {
        each: 0.05,
        yoyo: true,
        repeat: 1,
      },
    });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        텍스트 애니메이션
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        글자 단위로 분리하여 다양한 효과 적용
      </p>

      <div className="space-y-6">
        {/* Fade In */}
        <div className="flex items-center gap-4">
          <button
            onClick={playFadeIn}
            className="px-3 py-1.5 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-colors whitespace-nowrap"
          >
            Fade In
          </button>
          <div className="flex-1 h-14 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
            <div
              ref={text1Ref}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500"
              style={{ perspective: "500px" }}
            />
          </div>
        </div>

        {/* Scatter */}
        <div className="flex items-center gap-4">
          <button
            onClick={playScatter}
            className="px-3 py-1.5 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
          >
            흩어지기
          </button>
          <div className="flex-1 h-14 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
            <div
              ref={text2Ref}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500"
            />
          </div>
        </div>

        {/* Wave */}
        <div className="flex items-center gap-4">
          <button
            onClick={playWave}
            className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors whitespace-nowrap"
          >
            Wave
          </button>
          <div className="flex-1 h-14 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
            <div
              ref={text3Ref}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
