"use client";

import dynamic from "next/dynamic";

const RiverPhaserGame = dynamic(
  () => import("@/app/components/games/RiverPhaserGame"),
  { ssr: false, loading: () => <div className="w-full h-screen bg-black" /> }
);

export default function RiverPhaserPage() {
  return <RiverPhaserGame fullscreen />;
}
