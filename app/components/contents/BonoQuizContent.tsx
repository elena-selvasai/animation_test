"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { withBasePath } from "@/app/lib/constants";

// 보노 캐릭터 애니메이션 프레임 (9프레임)
const BONO_ANIMATION_FRAMES = [
  withBasePath("/bono/animation/bono_0000.png"),
  withBasePath("/bono/animation/bono_0001.png"),
  withBasePath("/bono/animation/bono_0002.png"),
  withBasePath("/bono/animation/bono_0003.png"),
  withBasePath("/bono/animation/bono_0004.png"),
  withBasePath("/bono/animation/bono_0005.png"),
  withBasePath("/bono/animation/bono_0006.png"),
  withBasePath("/bono/animation/bono_0007.png"),
  withBasePath("/bono/animation/bono_0008.png"),
];

// 국기 선택지 데이터
const FLAG_OPTIONS = [
  { id: 'brazil', src: withBasePath('/bono/quiz/flag-brazil.svg'), name: '브라질' },
  { id: 'usa', src: withBasePath('/bono/quiz/flag-usa.svg'), name: '미국' },
  { id: 'korea', src: withBasePath('/bono/quiz/flag-korea.svg'), name: '한국' },
  { id: 'france', src: withBasePath('/bono/quiz/flag-france.svg'), name: '프랑스' },
];

export default function BonoQuizContent() {
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showQuizScreen, setShowQuizScreen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  // 보노 캐릭터 애니메이션 (프레임 전환)
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % BONO_ANIMATION_FRAMES.length);
    }, 100); // 100ms마다 프레임 전환 (10fps)

    return () => clearInterval(animationInterval);
  }, []);

  const handleModeSelect = (mode: "basic" | "advanced") => {
    console.log(`Selected mode: ${mode}`);
    // 모드 선택 시 캐릭터 선택 팝업 표시
    setShowCharacterPopup(true);
  };

  const handleCharacterSelect = (index: number) => {
    setSelectedCharacter(index);
  };

  const handleStartLearning = () => {
    if (selectedCharacter !== null) {
      console.log(`Starting learning with character: ${selectedCharacter + 1}`);
      setShowCharacterPopup(false);
      setShowQuizScreen(true); // 퀴즈 화면으로 전환
    }
  };

  const handleClosePopup = () => {
    setShowCharacterPopup(false);
    setSelectedCharacter(null);
  };

  const handleFlagSelect = (flagId: string) => {
    setSelectedFlag(flagId);
  };

  const handleSubmitAnswer = () => {
    if (selectedFlag) {
      console.log(`Submitted answer: ${selectedFlag}`);
      // 다음 문제로 넘어가거나 결과 처리
      if (currentQuestion < 5) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedFlag(null);
      }
    }
  };

  const handleBackToMain = () => {
    setShowQuizScreen(false);
    setSelectedFlag(null);
    setCurrentQuestion(1);
  };

  // Scale factor: 원본 1920x1080 → 960x540 (0.5배)
  const scale = 0.5;

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <h1 className="text-2xl font-bold text-[#5B69E9] text-center">
        보노와 채팅하기
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md">
        보노와 함께 영어 학습을 시작하세요.
        <br />
        Basic 또는 Advanced 모드를 선택하여 학습을 시작합니다.
      </p>

      {/* Main Screen - 원본 1920x1080의 0.5배 스케일 */}
      <div 
        className={`relative bg-[#a6f2c6] ${showCharacterPopup ? '' : 'overflow-hidden'}`}
        style={{ width: 1920 * scale, height: 1080 * scale }}
      >
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={withBasePath("/bono/grid-pattern.svg")}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* Decorative Shape Background - Right Top */}
        <div 
          className="absolute overflow-hidden"
          style={{ 
            top: 0, 
            right: 0, 
            width: 699 * scale, 
            height: 336 * scale 
          }}
        >
          <Image
            src={withBasePath("/bono/shape-bg-1.svg")}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* Decorative Shape Background - Left Bottom */}
        <div 
          className="absolute overflow-hidden rotate-180"
          style={{ 
            bottom: 0, 
            left: 25 * scale, 
            width: 699 * scale, 
            height: 336 * scale 
          }}
        >
          <Image
            src={withBasePath("/bono/shape-bg-2.svg")}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* Main Content Card */}
        <div 
          className="absolute bg-[#eefff8] overflow-hidden"
          style={{ 
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1600 * scale,
            height: 800 * scale,
            border: `${15 * scale}px solid #4d4d4d`,
            borderRadius: 5 * scale,
          }}
        >
          {/* Digital Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={withBasePath("/bono/digital-bg.svg")}
              alt=""
              fill
              className="object-cover opacity-30"
            />
          </div>
        </div>

        {/* Shadow Ellipse (under character) */}
        <div 
          className="absolute"
          style={{ 
            left: 291.55 * scale, 
            top: 702.91 * scale,
            width: 350.281 * scale,
            height: 56.016 * scale,
          }}
        >
          <Image
            src={withBasePath("/bono/shadow-ellipse.svg")}
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Bono Character - 애니메이션 */}
        <div 
          className="absolute"
          style={{ 
            left: 160 * scale, 
            top: 188.5 * scale,
            width: 600 * scale,
            height: 600 * scale,
          }}
        >
          {/* 모든 프레임을 미리 로드하고, 현재 프레임만 표시 */}
          {BONO_ANIMATION_FRAMES.map((frame, index) => (
            <Image
              key={frame}
              src={frame}
              alt="보노 캐릭터"
              fill
              className="object-contain"
              style={{
                opacity: index === currentFrame ? 1 : 0,
                transition: 'opacity 0.05s ease-in-out',
              }}
              priority={index < 3} // 처음 3프레임 우선 로드
            />
          ))}
        </div>

        {/* Title Section */}
        <div 
          className="absolute flex items-end"
          style={{ 
            left: 756.5 * scale, 
            top: 397.5 * scale,
            gap: 15 * scale,
          }}
        >
          <span
            className="font-bold leading-none"
            style={{
              fontSize: 170 * scale,
              color: '#fecd44',
              textShadow: '1px 4px 0px #373636',
              fontFamily: "'Hakgyoansim Dunggeunmiso OTF', 'Black Han Sans', sans-serif",
              letterSpacing: 8.5 * scale,
              WebkitTextStroke: '1px #373636',
            }}
          >
            보노
          </span>
          <span
            className="font-medium leading-none"
            style={{
              fontSize: 85 * scale,
              color: '#ffffff',
              textShadow: '1px 4px 0px #373636',
              fontFamily: "'SB AggroOTF', 'Noto Sans KR', sans-serif",
              letterSpacing: 8.5 * scale,
              paddingBottom: 8 * scale,
            }}
          >
            와 채팅하기
          </span>
        </div>

        {/* Chat Icon */}
        <div 
          className="absolute"
          style={{ 
            left: 1477 * scale, 
            top: 339.5 * scale,
            width: 94 * scale,
            height: 77 * scale,
          }}
        >
          <Image
            src={withBasePath("/bono/chat-icon.svg")}
            alt="채팅 아이콘"
            fill
            className="object-contain"
          />
        </div>

        {/* Mode Selection Buttons */}
        <div 
          className="absolute flex"
          style={{ 
            left: 740 * scale, 
            top: 584.5 * scale,
          }}
        >
          {/* Basic Button */}
          <button
            onClick={() => handleModeSelect("basic")}
            className="flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{
              width: 410 * scale,
              height: 152 * scale,
              paddingLeft: 50 * scale,
              paddingRight: 50 * scale,
              paddingTop: 40 * scale,
              paddingBottom: 40 * scale,
              gap: 14 * scale,
              borderRadius: 20 * scale,
              background: "linear-gradient(to bottom, #04c9bf 50%, #067665 301.83%)",
              boxShadow: `0px ${6 * scale}px 0px 0px #176437`,
            }}
          >
            <span
              className="font-bold text-white"
              style={{ 
                fontSize: 40 * scale, 
                letterSpacing: -2 * scale,
                fontFamily: "Verdana, sans-serif",
                lineHeight: `${60 * scale}px`,
              }}
            >
              Basic
            </span>
            <span
              className="font-bold text-white"
              style={{ 
                fontSize: 26 * scale, 
                letterSpacing: -1.3 * scale,
                fontFamily: "'Noto Sans KR', Verdana, sans-serif",
                lineHeight: `${28 * scale}px`,
              }}
            >
              기본 모드로 학습하고 싶어요.
            </span>
          </button>

          {/* Gap between buttons */}
          <div style={{ width: 45 * scale }} />

          {/* Advanced Button */}
          <button
            onClick={() => handleModeSelect("advanced")}
            className="flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{
              width: 410 * scale,
              height: 152 * scale,
              paddingLeft: 50 * scale,
              paddingRight: 50 * scale,
              paddingTop: 40 * scale,
              paddingBottom: 40 * scale,
              gap: 14 * scale,
              borderRadius: 20 * scale,
              background: "linear-gradient(to bottom, #f2714c, #f84420 166.46%)",
              boxShadow: `0px ${6 * scale}px 0px 0px #a0361a`,
            }}
          >
            <span
              className="font-bold text-white"
              style={{ 
                fontSize: 40 * scale, 
                letterSpacing: -2 * scale,
                fontFamily: "Verdana, sans-serif",
                lineHeight: `${60 * scale}px`,
              }}
            >
              Advanced
            </span>
            <span
              className="font-bold text-white"
              style={{ 
                fontSize: 26 * scale, 
                letterSpacing: -1.3 * scale,
                fontFamily: "'Noto Sans KR', Verdana, sans-serif",
                lineHeight: `${28 * scale}px`,
              }}
            >
              어려운 모드로 학습하고 싶어요.
            </span>
          </button>
        </div>

        {/* Right Side Tab */}
        <div 
          className="absolute"
          style={{ 
            right: 0,
            top: '50%',
            transform: 'translateY(-50%) translateX(45%)',
          }}
        >
          <div 
            className="bg-[#4d4d4d] flex items-center justify-center rotate-90"
            style={{
              width: 400 * scale,
              height: 37 * scale,
              borderTopLeftRadius: 10 * scale,
              borderTopRightRadius: 10 * scale,
            }}
          >
            <div style={{ width: 17 * scale, height: 17 * scale }}>
              <Image
                src={withBasePath("/bono/side-tab-icon.svg")}
                alt=""
                width={17 * scale}
                height={17 * scale}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Left Side Tab */}
        <div 
          className="absolute"
          style={{ 
            left: 0,
            top: '50%',
            transform: 'translateY(-50%) translateX(-45%)',
          }}
        >
          <div 
            className="bg-[#4d4d4d] flex items-center justify-center -rotate-90"
            style={{
              width: 400 * scale,
              height: 24 * scale,
              borderTopLeftRadius: 10 * scale,
              borderTopRightRadius: 10 * scale,
            }}
          >
            <div style={{ width: 73 * scale, height: 4 * scale }}>
              <Image
                src={withBasePath("/bono/side-tab-text.svg")}
                alt=""
                width={73 * scale}
                height={4 * scale}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Quiz Screen */}
        {showQuizScreen && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 50 }}
          >
            {/* Quiz Container */}
            <div 
              className="relative bg-[#e9e9e9] overflow-hidden"
              style={{
                width: 1920 * scale,
                height: 1080 * scale,
              }}
            >
              {/* Main Frame Border */}
              <div
                className="absolute bg-[#4d4d4d]"
                style={{
                  left: 60 * scale,
                  top: 55.55 * scale,
                  width: 1800 * scale,
                  height: 1024.45 * scale,
                  borderTopLeftRadius: 5 * scale,
                  borderTopRightRadius: 5 * scale,
                }}
              />
              
              {/* White Content Area */}
              <div
                className="absolute bg-white"
                style={{
                  left: 70 * scale,
                  top: 84.55 * scale,
                  width: 1780 * scale,
                  height: 967 * scale,
                  borderRadius: 20 * scale,
                }}
              />

              {/* Top Header Bar */}
              <div
                className="absolute bg-[#a6f2c6] flex items-center justify-end px-10"
                style={{
                  left: 70 * scale,
                  top: 84.55 * scale,
                  width: 1780 * scale,
                  height: 100 * scale,
                  borderTopLeftRadius: 20 * scale,
                  borderTopRightRadius: 20 * scale,
                  paddingRight: 42 * scale,
                }}
              >
                {/* Tab Indicator */}
                <div 
                  className="absolute"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: -34 * scale,
                    width: 170 * scale,
                    height: 10 * scale,
                  }}
                >
                  <Image
                    src={withBasePath("/bono/quiz/group-37210.svg")}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Question Numbers */}
                <div className="flex" style={{ gap: 14 * scale }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={num}
                      className="flex items-center justify-center"
                      style={{
                        width: 60 * scale,
                        height: 60 * scale,
                        borderRadius: 16 * scale,
                        backgroundColor: currentQuestion === num ? '#22c467' : '#c2c2c2',
                      }}
                    >
                      <span
                        className="font-bold text-white"
                        style={{
                          fontSize: 34 * scale,
                          fontFamily: 'Verdana, sans-serif',
                          letterSpacing: -0.68 * scale,
                        }}
                      >
                        {num}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bono Question Bubble */}
              <div
                className="absolute"
                style={{
                  left: 100 * scale,
                  top: 220 * scale,
                }}
              >
                {/* Bono Avatar */}
                <div
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    width: 160 * scale,
                    height: 160 * scale,
                  }}
                >
                  <Image
                    src={withBasePath("/bono/quiz/bono-avatar.svg")}
                    alt="보노"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Speech Bubble */}
                <div
                  className="absolute bg-[#e5f6db] flex flex-col items-center"
                  style={{
                    left: 180 * scale,
                    top: 0,
                    width: 980 * scale,
                    height: 250 * scale,
                    borderRadius: 20 * scale,
                    padding: 40 * scale,
                    gap: 30 * scale,
                  }}
                >
                  {/* Tail */}
                  <div
                    className="absolute"
                    style={{
                      left: -35 * scale,
                      top: 50 * scale,
                      width: 70 * scale,
                      height: 70 * scale,
                    }}
                  >
                    <Image
                      src={withBasePath("/bono/quiz/bono-icon.svg")}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>

                  <span
                    className="font-bold text-center"
                    style={{
                      fontSize: 40 * scale,
                      color: '#1e1e1e',
                      fontFamily: "'Noto Sans KR', Verdana, sans-serif",
                    }}
                  >
                    대화를 듣고, Jian의 출신 국가가 어디인지 골라줘.
                  </span>

                  {/* Sound Button */}
                  <button
                    className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                    style={{
                      width: 110 * scale,
                      height: 110 * scale,
                    }}
                  >
                    <Image
                      src={withBasePath("/bono/quiz/sound-icon.svg")}
                      alt="소리 듣기"
                      width={110 * scale}
                      height={110 * scale}
                      className="object-contain"
                    />
                  </button>
                </div>
              </div>

              {/* User Chat Bubble */}
              <div
                className="absolute flex items-center"
                style={{
                  right: 100 * scale,
                  top: 475.8 * scale,
                  gap: 20 * scale,
                }}
              >
                {/* Chat Bubble */}
                <div
                  className="relative bg-[#ffc442] flex items-center justify-center"
                  style={{
                    width: 200 * scale,
                    height: 120 * scale,
                    borderRadius: 20 * scale,
                  }}
                >
                  {/* Tail */}
                  <div
                    className="absolute"
                    style={{
                      right: -35 * scale,
                      top: 25 * scale,
                      width: 70 * scale,
                      height: 70 * scale,
                      transform: 'rotate(180deg)',
                    }}
                  >
                    <Image
                      src={withBasePath("/bono/quiz/chat-tail.svg")}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>

                  <span
                    className="font-bold"
                    style={{
                      fontSize: 40 * scale,
                      color: '#1e1e1e',
                      fontFamily: 'Verdana, sans-serif',
                    }}
                  >
                    ···
                  </span>
                </div>

                {/* User Avatar */}
                <div
                  className="relative"
                  style={{
                    width: 150 * scale,
                    height: 150 * scale,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `6 * scale}px solid #ffc442`,
                      backgroundColor: '#fff',
                    }}
                  />
                  <div
                    className="absolute overflow-hidden rounded-full"
                    style={{
                      top: 3 * scale,
                      left: 3 * scale,
                      width: 144 * scale,
                      height: 144 * scale,
                    }}
                  >
                    <Image
                      src={selectedCharacter !== null ? withBasePath(`/bono/profile/profile-${selectedCharacter + 1}.png`) : withBasePath('/bono/quiz/profile-261185.png')}
                      alt="사용자"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `${6 * scale}px solid #ffc442`,
                    }}
                  />
                </div>
              </div>

              {/* Flag Selection Area */}
              <div
                className="absolute bg-[#f4f4f4] flex items-center justify-center"
                style={{
                  left: 120 * scale,
                  bottom: 63.28 * scale,
                  width: 1680 * scale,
                  height: 240 * scale,
                  borderRadius: 20 * scale,
                  boxShadow: '0px 8px 0px 0px rgba(0, 0, 0, 0.15)',
                  gap: 30 * scale,
                  paddingLeft: 45 * scale,
                  paddingRight: 125 * scale,
                }}
              >
                {/* Flag Options */}
                {FLAG_OPTIONS.map((flag) => (
                  <button
                    key={flag.id}
                    onClick={() => handleFlagSelect(flag.id)}
                    className="transition-transform hover:scale-105 active:scale-95 overflow-hidden"
                    style={{
                      width: 320 * scale,
                      height: 180 * scale,
                      borderRadius: 20 * scale,
                      border: selectedFlag === flag.id 
                        ? `${6 * scale}px solid #22c467` 
                        : `${6 * scale}px solid #888`,
                    }}
                  >
                    <Image
                      src={flag.src}
                      alt={flag.name}
                      width={320 * scale}
                      height={180 * scale}
                      className="object-cover"
                    />
                  </button>
                ))}

                {/* Send Button */}
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedFlag}
                  className="transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{
                    width: 80 * scale,
                    height: 80 * scale,
                  }}
                >
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: selectedFlag ? '#22c467' : '#c2c2c2',
                    }}
                  >
                    <Image
                      src={withBasePath("/bono/quiz/send-icon.svg")}
                      alt="전송"
                      width={34 * scale}
                      height={34 * scale}
                      className="object-contain"
                    />
                  </div>
                </button>
              </div>

              {/* Scrollbar */}
              <div
                className="absolute bg-[#d9d9d9]"
                style={{
                  right: 102.6 * scale,
                  top: 217 * scale,
                  width: 14 * scale,
                  height: 300 * scale,
                  borderRadius: 50 * scale,
                }}
              />

              {/* Back Button */}
              <button
                onClick={handleBackToMain}
                className="absolute text-white bg-[#666] hover:bg-[#555] transition-colors"
                style={{
                  left: 30 * scale,
                  top: 30 * scale,
                  padding: `${10 * scale}px ${20 * scale}px`,
                  borderRadius: 8 * scale,
                  fontSize: 14 * scale,
                }}
              >
                ← 뒤로
              </button>
            </div>
          </div>
        )}

        {/* Character Selection Popup */}
        {showCharacterPopup && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 100 }}
          >
            {/* Dim Overlay */}
            <div 
              className="absolute inset-0 bg-black/50 cursor-pointer"
              onClick={handleClosePopup}
            />
            
            {/* Popup Container - 메인 컨테이너(1920x1080 * 0.5)에 맞게 조정 */}
            <div 
              className="relative flex flex-col bg-white overflow-hidden"
              style={{
                width: 1400 * scale,
                height: 620 * scale,
                borderRadius: 20 * scale,
                boxShadow: `0px ${10 * scale}px ${30 * scale}px rgba(0, 0, 0, 0.25)`,
                border: `${1 * scale}px solid #000`,
              }}
            >
              {/* Top Section with Green Background */}
              <div 
                className="flex items-center"
                style={{
                  backgroundColor: '#f1ffe9',
                  borderBottom: `${6 * scale}px solid #cbe0bf`,
                  padding: `${25 * scale}px ${80 * scale}px`,
                  borderTopLeftRadius: 20 * scale,
                  borderTopRightRadius: 20 * scale,
                }}
              >
                {/* Bono Avatar */}
                <div 
                  style={{
                    width: 100 * scale,
                    height: 100 * scale,
                    flexShrink: 0,
                    marginRight: 16 * scale,
                  }}
                >
                  <Image
                    src={withBasePath("/bono/bono-avatar.svg")}
                    alt="보노"
                    width={100 * scale}
                    height={100 * scale}
                    className="object-contain"
                  />
                </div>
                
                {/* Speech Bubble Text */}
                <div 
                  className="flex flex-col"
                  style={{
                    fontFamily: "'Noto Sans KR', Verdana, sans-serif",
                  }}
                >
                  <span
                    className="font-bold"
                    style={{
                      fontSize: 28 * scale,
                      color: '#1e1e1e',
                      lineHeight: `${42 * scale}px`,
                    }}
                  >
                    안녕, 난 보노야.
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: 28 * scale,
                      color: '#1e1e1e',
                      lineHeight: `${42 * scale}px`,
                    }}
                  >
                    네가 사용할 프로필 이미지를 골라 봐.
                  </span>
                </div>
              </div>

              {/* Character Grid Section */}
              <div 
                className="flex-1 flex flex-col items-center justify-center"
                style={{
                  padding: `${20 * scale}px`,
                }}
              >
                {/* Character Grid - 프로필 200x200 */}
                <div 
                  className="flex justify-center"
                  style={{
                    gap: 20 * scale,
                    marginBottom: 25 * scale,
                  }}
                >
                  {[1, 2, 3, 4].map((num, index) => (
                    <button
                      key={index}
                      onClick={() => handleCharacterSelect(index)}
                      className="relative transition-transform hover:scale-105 active:scale-95"
                      style={{
                        width: 200 * scale,
                        height: 200 * scale,
                      }}
                    >
                      {/* Profile Circle Border */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: selectedCharacter === index 
                            ? `${8 * scale}px solid #FECD44` 
                            : `${4 * scale}px solid #CCCCCC`,
                          backgroundColor: '#fff',
                        }}
                      />
                      
                      {/* Profile Image */}
                      <div
                        className="absolute overflow-hidden rounded-full"
                        style={{
                          top: selectedCharacter === index ? 8 * scale : 4 * scale,
                          left: selectedCharacter === index ? 8 * scale : 4 * scale,
                          width: selectedCharacter === index ? (200 - 16) * scale : (200 - 8) * scale,
                          height: selectedCharacter === index ? (200 - 16) * scale : (200 - 8) * scale,
                        }}
                      >
                        <Image
                          src={withBasePath(`/bono/profile/profile-${num}.png`)}
                          alt={`캐릭터 ${num}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Start Button - 220x55 */}
                <button
                  onClick={handleStartLearning}
                  disabled={selectedCharacter === null}
                  className="transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    width: 220 * scale,
                    height: 55 * scale,
                    borderRadius: 35 * scale,
                    backgroundColor: selectedCharacter !== null ? '#40affe' : '#A0A0A0',
                    boxShadow: selectedCharacter !== null 
                      ? `0px ${4 * scale}px 0px 0px #26485f` 
                      : `0px ${4 * scale}px 0px 0px #7A7A7A`,
                    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <span
                    className="font-bold text-white"
                    style={{
                      fontSize: 28 * scale,
                      fontFamily: "'Noto Sans KR', Verdana, sans-serif",
                    }}
                  >
                    시작하기
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
