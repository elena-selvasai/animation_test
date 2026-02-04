"use client";

import dynamic from "next/dynamic";

const RiverMotionGame = dynamic(
  () => import("@/app/components/games/RiverMotionGame"),
  { ssr: false, loading: () => <div className="w-full h-screen bg-black" /> }
);

export default function RiverPage() {
  return <RiverMotionGame fullscreen />;
}
