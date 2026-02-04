"use client";

import Link from "next/link";
import {
  BasicTweens,
  EasingDemo,
  TimelineDemo,
  StaggerDemo,
  TextAnimation,
  SvgAnimation,
} from "../gsap";

export default function GsapExamplesContent() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center mb-2">
        GSAP 애니메이션 예제
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-8">
        GSAP(GreenSock Animation Platform)의 다양한 애니메이션 기능을 인터랙티브하게 체험해보세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Basic Tweens */}
        <BasicTweens />

        {/* Easing Demo */}
        <EasingDemo />

        {/* Timeline Demo */}
        <TimelineDemo />

        {/* Stagger Demo */}
        <StaggerDemo />

        {/* Text Animation */}
        <TextAnimation />

        {/* SVG Animation */}
        <SvgAnimation />
      </div>

      <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
        각 카드의 버튼을 클릭하여 애니메이션을 실행해보세요
      </div>
    </div>
  );
}
