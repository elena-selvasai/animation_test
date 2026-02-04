"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const RiverMotionGame = dynamic(
  () => import("@/app/components/games/RiverMotionGame"),
  { ssr: false, loading: () => <div className="w-full aspect-video bg-black rounded-xl animate-pulse" /> }
);

export default function RiverContent() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold text-[#5B69E9]">River Flow</h1>
        <Link
          href="/river"
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          전체화면 →
        </Link>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-4">
        Motion (Framer Motion)을 사용한 River 애니메이션입니다.
      </p>

      {/* 게임 컨테이너 */}
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <RiverMotionGame />
      </div>

      <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full">
        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          사용 기술
        </h4>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• Motion (Framer Motion) 애니메이션</li>
          <li>• HTML5 Video 배경</li>
          <li>• 키보드 인터랙션</li>
        </ul>
      </div>
    </div>
  );
}
