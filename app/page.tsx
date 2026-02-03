"use client";

import { useState } from "react";
import { Tab, TabConfig } from "./types";
import { AppLoadContent, AnimationContent, WarmingUpContent, GsapExamplesContent, MotionExamplesContent } from "./components/contents";

// Tab configuration
const tabs: TabConfig[] = [
  { id: "appLoad", label: "앱 로딩", icon: "📱" },
  { id: "animation", label: "애니메이션", icon: "🎬" },
  { id: "warmingUp", label: "학습 활동", icon: "📚" },
  { id: "gsapExamples", label: "GSAP", icon: "✨" },
  { id: "motionExamples", label: "Motion", icon: "🎭" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("appLoad");

  const renderContent = () => {
    switch (activeTab) {
      case "appLoad":
        return <AppLoadContent />;
      case "animation":
        return <AnimationContent />;
      case "warmingUp":
        return <WarmingUpContent />;
      case "gsapExamples":
        return <GsapExamplesContent />;
      case "motionExamples":
        return <MotionExamplesContent />;
      default:
        return <AppLoadContent />;
    }
  };

  return (
    <div className="w-screen min-h-screen overflow-hidden bg-zinc-100 font-sans dark:bg-zinc-900 flex">
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }
      `}</style>

      {/* Left Sidebar with Tabs */}
      <aside className="w-20 min-h-screen bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center py-4 gap-2 shadow-lg">
        <div className="text-lg font-bold text-[#5B69E9] mb-4">Demo</div>
        {tabs.map((tab) => (
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
            <span className="text-[10px] font-medium leading-tight text-center">{tab.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-auto py-8 px-4 flex items-start justify-center">
        {renderContent()}
      </main>
    </div>
  );
}
