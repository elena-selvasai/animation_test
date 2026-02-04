"use client";

import dynamic from "next/dynamic";

const RiverPixiGame = dynamic(() => import("./RiverPixiGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-white text-xl">
      로딩 중...
    </div>
  ),
});

export default function RiverPixiPage() {
  return <RiverPixiGame />;
}
