"use client";

import WarmingUpScreen from "../WarmingUpScreen";

export default function WarmingUpContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <h1 className="text-2xl font-bold text-[#b777e9] text-center">
        Warming Up - 드래그 앤 드롭
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md">
        현장 체험학습 활동을 위한 드래그 앤 드롭 인터랙션입니다.
        <br />
        붙임 딱지를 드래그하여 이미지 위에 배치해 보세요.
      </p>

      <WarmingUpScreen width={960} height={540} />
    </div>
  );
}
