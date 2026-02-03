"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import EmailListScreen from "./components/EmailListScreen";
import CharacterAnimation from "./components/CharacterAnimation";
import TitleAnimation from "./components/TitleAnimation";
import TitleAnimationGSAP from "./components/TitleAnimationGSAP";
import WarmingUpScreen from "./components/WarmingUpScreen";

type Tab = "appLoad" | "animation" | "warmingUp";
type Screen = "login" | "emailList";

// ============================================
// App Load Animation Content
// ============================================
function LoginScreen({
  width,
  height,
  onSignIn,
}: {
  width: number;
  height: number;
  onSignIn: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const emailLabelRef = useRef<HTMLDivElement>(null);
  const passwordLabelRef = useRef<HTMLDivElement>(null);
  const emailValueRef = useRef<HTMLDivElement>(null);
  const passwordValueRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const scale = width / 360;

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      paused: false,
      onComplete: () => {
        setIsPlaying(false);
        setAnimationComplete(true);
      },
      onStart: () => setIsPlaying(true),
    });

    tl.fromTo(
      iconRef.current,
      { scale: 0.177, rotation: -135, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );

    tl.to(iconRef.current, { y: -36, duration: 0.4, ease: "power2.inOut" }, "+=0.2");
    tl.to(iconRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, "+=0.3");
    tl.to(statusBarRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.1");

    tl.fromTo(
      [emailInputRef.current, passwordInputRef.current, buttonRef.current],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: "power2.out" },
      "-=0.2"
    );

    tl.to(emailLabelRef.current, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "+=0.3");
    tl.to(emailValueRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, "+=0.1");
    tl.to(passwordLabelRef.current, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "+=0.2");
    tl.to(passwordValueRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, "+=0.1");

    timelineRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  const handleReplay = () => {
    setAnimationComplete(false);
    if (timelineRef.current) {
      timelineRef.current.restart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[24px] shadow-xl"
        style={{ width: `${width}px`, height: `${height}px`, backgroundColor: "#5B69E9" }}
      >
        <div
          ref={statusBarRef}
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 opacity-0"
          style={{ height: `${24 * scale}px`, backgroundColor: "#2E2EAB" }}
        >
          <span className="text-white font-normal opacity-90" style={{ fontSize: `${13 * scale}px`, fontFamily: "Roboto, sans-serif" }}>FIGMA</span>
          <span className="text-white font-normal opacity-90" style={{ fontSize: `${13 * scale}px`, fontFamily: "Roboto, sans-serif" }}>12:30</span>
          <div className="flex items-center gap-1">
            <svg width={16 * scale} height={12 * scale} viewBox="0 0 16 12" fill="white">
              <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" />
              <path d="M4.5 7C5.5 5.5 6.5 5 8 5C9.5 5 10.5 5.5 11.5 7" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M2 4C4 2 6 1 8 1C10 1 12 2 14 4" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
            <svg width={12 * scale} height={12 * scale} viewBox="0 0 12 12" fill="white">
              <rect x="0" y="8" width="2" height="4" rx="0.5" />
              <rect x="3" y="6" width="2" height="6" rx="0.5" />
              <rect x="6" y="4" width="2" height="8" rx="0.5" />
              <rect x="9" y="2" width="2" height="10" rx="0.5" />
            </svg>
            <svg width={8 * scale} height={13 * scale} viewBox="0 0 8 13" fill="white">
              <rect x="0" y="2" width="8" height="11" rx="1" />
              <rect x="2" y="0" width="4" height="2" rx="0.5" />
            </svg>
          </div>
        </div>

        <div
          ref={iconRef}
          className="absolute flex items-center justify-center"
          style={{ width: `${160 * scale}px`, height: `${160 * scale}px`, left: `${100 * scale}px`, top: `${178 * scale}px`, opacity: 0 }}
        >
          <div className="absolute rounded-full bg-white" style={{ width: `${120 * scale}px`, height: `${120 * scale}px` }} />
          <div
            className="absolute rounded-lg border-4 border-white"
            style={{ width: `${67 * scale}px`, height: `${52 * scale}px`, background: "linear-gradient(92.14deg, #2E43FF 5.06%, #642EFF 89.13%)", top: `${54 * scale}px`, left: `${47 * scale}px`, borderRadius: `${8 * scale}px` }}
          />
          <svg className="absolute" style={{ width: `${67.28 * scale}px`, height: `${31 * scale}px`, top: `${54 * scale}px`, left: `${46.86 * scale}px` }} viewBox="0 0 67.2758 31" fill="none">
            <path d="M8.01367 1.5H59.2627C65.9136 1.50029 68.2715 10.306 62.5107 13.6299L36.6475 28.5508C35.6777 29.1102 34.5447 29.5 33.6377 29.5C32.7307 29.4999 31.5976 29.1102 30.6279 28.5508L4.76563 13.6299C-0.99561 10.3061 1.3624 1.5 8.01367 1.5Z" fill="url(#envelope-gradient)" stroke="white" strokeWidth="3" />
            <defs><linearGradient id="envelope-gradient" x1="-16.4309" y1="3.32143" x2="78.5654" y2="13.1713" gradientUnits="userSpaceOnUse"><stop stopColor="#2E43FF" /><stop offset="1" stopColor="#642EFF" /></linearGradient></defs>
          </svg>
        </div>

        <div ref={emailInputRef} className="absolute opacity-0" style={{ width: `${327 * scale}px`, height: `${80 * scale}px`, left: `${16 * scale}px`, top: `${220 * scale}px` }}>
          <div ref={emailLabelRef} className="text-white opacity-0" style={{ fontSize: `${14 * scale}px`, fontFamily: "Roboto, sans-serif", letterSpacing: "0.28px", marginBottom: `${8 * scale}px`, transform: "translateY(10px)" }}>Email Address</div>
          <div className="rounded-lg" style={{ backgroundColor: "#6A77ED", height: `${48 * scale}px`, borderRadius: `${8 * scale}px`, padding: `${12 * scale}px ${14 * scale}px` }}>
            <span ref={emailValueRef} className="text-white opacity-0" style={{ fontSize: `${18 * scale}px`, fontFamily: "Roboto, sans-serif", letterSpacing: "0.36px" }}>support@figma.com</span>
          </div>
        </div>

        <div ref={passwordInputRef} className="absolute opacity-0" style={{ width: `${327 * scale}px`, height: `${80 * scale}px`, left: `${16 * scale}px`, top: `${304 * scale}px` }}>
          <div ref={passwordLabelRef} className="text-white opacity-0" style={{ fontSize: `${14 * scale}px`, fontFamily: "Roboto, sans-serif", letterSpacing: "0.28px", marginBottom: `${8 * scale}px`, transform: "translateY(10px)" }}>Password</div>
          <div className="rounded-lg" style={{ backgroundColor: "#6A77ED", height: `${48 * scale}px`, borderRadius: `${8 * scale}px`, padding: `${12 * scale}px ${14 * scale}px` }}>
            <span ref={passwordValueRef} className="text-white opacity-0" style={{ fontSize: `${18 * scale}px`, fontFamily: "Roboto, sans-serif", letterSpacing: "0.36px" }}>•••••••••••••••••••••</span>
          </div>
        </div>

        <div
          ref={buttonRef}
          onClick={animationComplete ? onSignIn : undefined}
          className={`absolute opacity-0 transition-transform ${animationComplete ? "cursor-pointer hover:scale-105" : ""}`}
          style={{ width: `${327 * scale}px`, height: `${56 * scale}px`, left: `${16 * scale}px`, top: `${544 * scale}px` }}
        >
          <div className="flex items-center justify-center h-full bg-white" style={{ borderRadius: `${100 * scale}px` }}>
            <span className="font-medium" style={{ fontSize: `${18 * scale}px`, fontFamily: "Roboto, sans-serif", letterSpacing: "0.36px", background: "linear-gradient(102.06deg, #2E43FF 5.06%, #642EFF 89.13%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Sign in
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleReplay}
          disabled={isPlaying}
          className="px-4 py-2 bg-[#5B69E9] text-white rounded-lg hover:bg-[#4A58D8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {isPlaying ? "재생 중..." : "다시 재생"}
        </button>
        {animationComplete && (
          <button
            onClick={onSignIn}
            className="px-4 py-2 bg-[#FF005C] text-white rounded-lg hover:bg-[#E00050] transition-colors"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            이메일 목록 보기
          </button>
        )}
      </div>
    </div>
  );
}

function AppLoadContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);

  const handleSignIn = () => {
    setIsTransitioning(true);
    gsap.to(screenRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setCurrentScreen("emailList");
        gsap.fromTo(
          screenRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", onComplete: () => setIsTransitioning(false) }
        );
      },
    });
  };

  const handleBack = () => {
    setIsTransitioning(true);
    gsap.to(screenRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setCurrentScreen("login");
        gsap.fromTo(
          screenRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", onComplete: () => setIsTransitioning(false) }
        );
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center">
        {currentScreen === "login" ? "앱 로딩 애니메이션" : "이메일 리스트 (Pull to Refresh)"}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md">
        {currentScreen === "login" ? (
          <>
            Figma 디자인을 기반으로 구현된 앱 로딩 애니메이션입니다.
            <br />
            메일 아이콘이 등장하고 로그인 폼으로 전환됩니다.
          </>
        ) : (
          <>
            아래로 드래그하여 Pull to Refresh를 테스트하세요.
            <br />
            새로운 이메일이 추가됩니다. FAB 버튼을 클릭하면 로그인 화면으로 돌아갑니다.
          </>
        )}
      </p>

      <div ref={screenRef} className={isTransitioning ? "pointer-events-none" : ""}>
        {currentScreen === "login" ? (
          <LoginScreen width={360} height={640} onSignIn={handleSignIn} />
        ) : (
          <EmailListScreen width={360} height={640} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}

// ============================================
// Title & Character Animation Content
// ============================================
function AnimationContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center">
        타이틀 & 캐릭터 애니메이션
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md">
        CSS와 GSAP으로 구현된 타이틀 애니메이션과 캐릭터 애니메이션입니다.
      </p>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold text-black dark:text-white mb-2 text-center">
            CSS 버전
          </h2>
          <TitleAnimation
            width={250}
            height={125}
            fps={24}
            loop={true}
            autoPlay={true}
          />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold text-green-600 dark:text-green-400 mb-2 text-center">
            GSAP 버전
          </h2>
          <TitleAnimationGSAP
            width={250}
            height={125}
            fps={24}
            loop={true}
            autoPlay={true}
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <h2 className="text-base font-bold text-black dark:text-white mb-2 text-center">
          캐릭터 애니메이션
        </h2>
        <CharacterAnimation />
      </div>
    </div>
  );
}

// ============================================
// Warming Up Content (Drag & Drop)
// ============================================
function WarmingUpContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <h1 className="text-2xl font-bold text-[#b777e9] text-center">
        Warming Up - 드래그 앤 드롭
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md">
        현장 체험학습 활동을 위한 드래그 앤 드롭 인터랙션입니다.
        <br />
        붙임 딱지를 드래그하여 이미지 위에 배치해 보세요.
      </p>

      <WarmingUpScreen width={960} height={540} />
    </div>
  );
}

// ============================================
// Main Page with Tab Navigation
// ============================================
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("appLoad");

  const tabs = [
    { id: "appLoad" as Tab, label: "앱 로딩", icon: "📱" },
    { id: "animation" as Tab, label: "애니메이션", icon: "🎬" },
    { id: "warmingUp" as Tab, label: "학습 활동", icon: "📚" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "appLoad":
        return <AppLoadContent />;
      case "animation":
        return <AnimationContent />;
      case "warmingUp":
        return <WarmingUpContent />;
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
