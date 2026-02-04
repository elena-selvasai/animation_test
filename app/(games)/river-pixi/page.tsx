"use client";

import dynamic from "next/dynamic";

const RiverPixiGame = dynamic(
  () => import("@/app/components/games/RiverPixiGame"),
  { ssr: false, loading: () => <div className="w-full h-screen bg-black" /> }
);

export default function RiverPixiPage() {
  return <RiverPixiGame fullscreen />;
}
