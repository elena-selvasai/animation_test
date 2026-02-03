"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { Screen } from "@/app/types";
import LoginScreen from "../LoginScreen";
import EmailListScreen from "../EmailListScreen";

export default function AppLoadContent() {
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
