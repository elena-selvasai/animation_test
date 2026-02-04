"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const RiverPhaserGame = dynamic(
  () => import("@/app/components/games/RiverPhaserGame"),
  { ssr: false, loading: () => <div className="w-full aspect-video bg-black rounded-xl animate-pulse" /> }
);

export default function RiverPhaserContent() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold text-[#5B69E9]">River Flow - Phaser</h1>
        <Link
          href="/river-phaser"
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          전체화면 →
        </Link>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-4">
        Phaser 게임 엔진을 사용한 River Flow 애니메이션입니다.
      </p>

      {/* 게임 컨테이너 */}
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        <RiverPhaserGame />
      </div>

      <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full">
        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          사용 기술
        </h4>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• Phaser 3 게임 엔진</li>
          <li>• WebGL 렌더링</li>
          <li>• Tween 애니메이션</li>
          <li>• Video 배경 및 바위 애니메이션</li>
          <li>• ← → 또는 A D: 로봇 이동</li>
        </ul>
      </div>
    </div>
  );
}
