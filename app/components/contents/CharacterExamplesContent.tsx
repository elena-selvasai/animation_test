"use client";

import { CharacterSvgAnimation } from "../demos/character";

export default function CharacterExamplesContent() {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center mb-2">
        SVG 캐릭터 애니메이션
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-8">
        순수 React와 키프레임 보간을 사용한 SVG 캐릭터 애니메이션입니다.
      </p>

      <CharacterSvgAnimation />

      <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full">
        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          구현 방식
        </h4>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• 키프레임 배열 + 선형 보간 (Linear Interpolation)</li>
          <li>• requestAnimationFrame 기반 애니메이션 루프</li>
          <li>• SVG transform 속성으로 부분별 애니메이션</li>
          <li>• React useState로 실시간 값 관리</li>
        </ul>
      </div>
    </div>
  );
}
