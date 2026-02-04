"use client";

import { TitleAnimation, TitleAnimationGSAP, CharacterAnimation } from "../screens";

export default function AnimationContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center">
        타이틀 & 캐릭터 애니메이션
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md">
        CSS와 GSAP으로 구현된 타이틀 애니메이션과 캐릭터 애니메이션입니다.
      </p>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold text-black dark:text-white mb-2 text-center">
            CSS 버전
          </h2>
          <TitleAnimation
            width={250}
            height={125}
            fps={24}
            loop={true}
            autoPlay={true}
          />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold text-green-600 dark:text-green-400 mb-2 text-center">
            GSAP 버전
          </h2>
          <TitleAnimationGSAP
            width={250}
            height={125}
            fps={24}
            loop={true}
            autoPlay={true}
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <h2 className="text-base font-bold text-black dark:text-white mb-2 text-center">
          캐릭터 애니메이션
        </h2>
        <CharacterAnimation />
      </div>
    </div>
  );
}
