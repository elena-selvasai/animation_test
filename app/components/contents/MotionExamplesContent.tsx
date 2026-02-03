"use client";

import {
  BasicAnimations,
  GesturesDemo,
  VariantsDemo,
  LayoutDemo,
  KeyframesDemo,
  SpringDemo,
} from "../motion";

export default function MotionExamplesContent() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center mb-2">
        Motion 애니메이션 예제
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-8">
        Motion(Framer Motion) 라이브러리의 다양한 애니메이션 기능을 인터랙티브하게 체험해보세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Basic Animations */}
        <BasicAnimations />

        {/* Gestures Demo */}
        <GesturesDemo />

        {/* Variants Demo */}
        <VariantsDemo />

        {/* Layout Demo */}
        <LayoutDemo />

        {/* Keyframes Demo */}
        <KeyframesDemo />

        {/* Spring Demo */}
        <SpringDemo />
      </div>

      <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
        버튼 클릭, 호버, 드래그 등 다양한 인터랙션을 시도해보세요
      </div>
    </div>
  );
}
