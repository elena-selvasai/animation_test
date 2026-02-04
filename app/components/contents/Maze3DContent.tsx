"use client";

import { Maze3DGame } from "../demos/gsap";

export default function Maze3DContent() {
  return (
    <div className="flex flex-col items-center w-full max-w-5xl">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center mb-2">
        3D 미로 탈출
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-6">
        React Three Fiber를 사용한 1인칭 3D 미로 게임입니다.
      </p>

      <Maze3DGame />

      <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full">
        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          조작법
        </h4>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• WASD 또는 방향키로 이동</li>
          <li>• 마우스로 시점 회전</li>
          <li>• ESC로 마우스 잠금 해제</li>
          <li>• 💎 코인을 수집하고 🚩에 도착하세요!</li>
        </ul>
      </div>
    </div>
  );
}
