"use client";

import Link from "next/link";
import { Maze3DGame } from "@/app/components/demos/gsap";

export default function Maze3DPage() {
  return (
    <main className="min-h-screen bg-zinc-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
          >
            ← 홈으로
          </Link>
          <Link
            href="/maze"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            2D 버전 →
          </Link>
        </div>

        {/* 게임 */}
        <Maze3DGame />

        {/* 설명 */}
        <div className="mt-6 p-4 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
          <h3 className="font-bold text-white mb-2">3D 미로 탈출</h3>
          <p className="mb-2">React Three Fiber를 사용한 1인칭 3D 미로 게임입니다.</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>WASD 또는 방향키로 이동</li>
            <li>마우스로 시점 회전</li>
            <li>ESC로 마우스 잠금 해제</li>
            <li>💎 코인을 수집하고 🚩에 도착하세요!</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
