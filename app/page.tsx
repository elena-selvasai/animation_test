"use client";

import { useState } from "react";
import { Tab, TabConfig } from "./types";
import {
  AppLoadContent,
  AnimationContent,
  GsapExamplesContent,
  MotionExamplesContent,
  CharacterExamplesContent,
  RiverContent,
  RiverPhaserContent,
  RiverPixiContent,
  MazeContent,
  Maze3DContent,
  BonoQuizContent,
} from "./components/contents";

// Tab configuration with groups
const tabs: TabConfig[] = [
  // 기본 데모
  { id: "animation", label: "애니메이션", icon: "🎬", group: "demos" },
  { id: "gsapExamples", label: "GSAP", icon: "✨", group: "demos" },
  { id: "motionExamples", label: "Motion", icon: "🎭", group: "demos" },
  { id: "characterExamples", label: "캐릭터", icon: "🐰", group: "demos" },
  // River 게임
  { id: "river", label: "River", icon: "🌊", group: "river" },
  { id: "riverPhaser", label: "Phaser", icon: "🎮", group: "river" },
  { id: "riverPixi", label: "PixiJS", icon: "🏊", group: "river" },
  // 미로 게임
  { id: "maze", label: "미로2D", icon: "🏃", group: "maze" },
  { id: "maze3d", label: "미로3D", icon: "🎯", group: "maze" },
  // Figma Test
  { id: "appLoad", label: "앱 로딩", icon: "📱", group: "figma-test" },
  { id: "bono", label: "Bono Quiz", icon: "🎤", group: "figma-test" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("appLoad");

  const renderContent = () => {
    switch (activeTab) {
      case "appLoad":
        return <AppLoadContent />;
      case "animation":
        return <AnimationContent />;
      case "gsapExamples":
        return <GsapExamplesContent />;
      case "motionExamples":
        return <MotionExamplesContent />;
      case "characterExamples":
        return <CharacterExamplesContent />;
      case "river":
        return <RiverContent />;
      case "riverPhaser":
        return <RiverPhaserContent />;
      case "riverPixi":
        return <RiverPixiContent />;
      case "maze":
        return <MazeContent />;
      case "maze3d":
        return <Maze3DContent />;
      case "bono":
        return <BonoQuizContent />;
      default:
        return <AppLoadContent />;
    }
  };

  // 그룹별로 탭 분류
  const demoTabs = tabs.filter((t) => t.group === "demos");
  const riverTabs = tabs.filter((t) => t.group === "river");
  const mazeTabs = tabs.filter((t) => t.group === "maze");
  const figmaTestTabs = tabs.filter((t) => t.group === "figma-test");

  const renderTabButton = (tab: TabConfig) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
        activeTab === tab.id
          ? "bg-[#5B69E9] text-white shadow-md scale-105"
          : "bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-400 dark:hover:bg-zinc-600"
      }`}
    >
      <span className="text-xl">{tab.icon}</span>
      <span className="text-[10px] font-medium leading-tight text-center">
        {tab.label}
      </span>
    </button>
  );

  return (
    <div className="w-screen min-h-screen overflow-hidden bg-zinc-100 font-sans dark:bg-zinc-900 flex">
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }
      `}</style>

      {/* Left Sidebar with Tabs */}
      <aside className="w-20 min-h-screen bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center py-4 gap-2 shadow-lg overflow-y-auto">
        <div className="text-lg font-bold text-[#5B69E9] mb-2">Demo</div>

        {/* 기본 데모 탭 */}
        {demoTabs.map(renderTabButton)}

        {/* 구분선 - River */}
        <div className="w-12 h-px bg-zinc-400 dark:bg-zinc-600 my-1" />
        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
          RIVER
        </span>
        {riverTabs.map(renderTabButton)}

        {/* 구분선 - Maze */}
        <div className="w-12 h-px bg-zinc-400 dark:bg-zinc-600 my-1" />
        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
          MAZE
        </span>
        {mazeTabs.map(renderTabButton)}

        {/* 구분선 - Bono */}
        <div className="w-12 h-px bg-zinc-400 dark:bg-zinc-600 my-1" />
        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
          BONO
        </span>
        {figmaTestTabs.map(renderTabButton)}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-auto py-8 px-4 flex items-start justify-center">
        {renderContent()}
      </main>
    </div>
  );
}
