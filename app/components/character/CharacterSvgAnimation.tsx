"use client";

import { useState, useCallback } from "react";

interface CharacterProps {
  leftEyeScaleY?: number;
  rightEyeScaleY?: number;
  rightArmRotation?: number;
  leftEarRotation?: number;
  rightEarRotation?: number;
}

// SVG 토끼 캐릭터 컴포넌트
function CharacterSVG({
  leftEyeScaleY = 1,
  rightEyeScaleY = 1,
  rightArmRotation = 0,
  leftEarRotation = 0,
  rightEarRotation = 0,
}: CharacterProps) {
  return (
    <svg width="250" height="325" viewBox="0 0 500 650">
      <defs>
        <style>{`
          .fur-outline { fill: #FFFFFF; stroke: #4E3333; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; }
          .ear-inner { fill: #F4B8B8; stroke: none; }
          .hoodie-blue { fill: #7DAFF3; stroke: #4E3333; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; }
          .hoodie-detail { fill: none; stroke: #4E3333; stroke-width: 5; stroke-linecap: round; }
          .feature-fill { fill: #4E3333; }
          .feature-stroke { fill: none; stroke: #4E3333; stroke-width: 5; stroke-linecap: round; }
          .blush { fill: #F4B8B8; opacity: 0.6; }
        `}</style>
      </defs>

      {/* 왼쪽 귀 (애니메이션) */}
      <g transform={`rotate(${-12 + leftEarRotation} 220 130)`}>
        <ellipse cx="220" cy="80" rx="38" ry="90" className="fur-outline" />
        <ellipse cx="220" cy="90" rx="22" ry="65" className="ear-inner" />
      </g>

      {/* 오른쪽 귀 (애니메이션) */}
      <g transform={`rotate(${12 + rightEarRotation} 340 130)`}>
        <ellipse cx="340" cy="80" rx="38" ry="90" className="fur-outline" />
        <ellipse cx="340" cy="90" rx="22" ry="65" className="ear-inner" />
      </g>

      {/* 발 */}
      <g transform="translate(0, 50)">
        <ellipse cx="235" cy="520" rx="40" ry="30" className="fur-outline" />
        <ellipse cx="325" cy="520" rx="40" ry="30" className="fur-outline" />
      </g>


      {/* 후드티 */}
      <path d="M 190 350
               C 190 300, 370 300, 370 350
               L 380 480
               C 380 530, 180 530, 180 480
               Z" className="hoodie-blue" />
      <path d="M 220 460 Q 280 500 340 460" className="hoodie-detail" />

      {/* 머리 */}
      <ellipse cx="280" cy="260" rx="120" ry="105" className="fur-outline" />

      {/* 얼굴 */}
      <g>
        {/* 왼쪽 눈 (애니메이션) */}
        <g transform={`translate(235, 250) scale(1, ${leftEyeScaleY})`}>
          <circle cx="0" cy="0" r="14" className="feature-fill" />
          <circle cx="-5" cy="-5" r="4" fill="white" />
        </g>

        {/* 오른쪽 눈 (애니메이션) */}
        <g transform={`translate(325, 250) scale(1, ${rightEyeScaleY})`}>
          <circle cx="0" cy="0" r="14" className="feature-fill" />
          <circle cx="-5" cy="-5" r="4" fill="white" />
        </g>

        {/* 볼터치 */}
        <ellipse cx="200" cy="275" rx="18" ry="10" className="blush" />
        <ellipse cx="360" cy="275" rx="18" ry="10" className="blush" />

        {/* 코 */}
        <ellipse cx="280" cy="285" rx="14" ry="9" className="feature-fill" />

        {/* 입 */}
        <path d="M 280 290 L 280 305 M 255 305 Q 280 330 305 305" className="feature-stroke" />
      </g>

      {/* 후드 끈 */}
      <g>
        <line x1="250" y1="360" x2="250" y2="400" className="feature-stroke" strokeWidth="4" />
        <circle cx="250" cy="405" r="6" className="feature-fill" />
        <line x1="310" y1="360" x2="310" y2="400" className="feature-stroke" strokeWidth="4" />
        <circle cx="310" cy="405" r="6" className="feature-fill" />
      </g>

      {/* 왼팔 */}
      <circle cx="160" cy="450" r="35" className="fur-outline" />

      {/* 오른팔 (애니메이션) - 어깨(왼쪽 하단) 기준 회전 */}
      <g transform={`rotate(${rightArmRotation} 370 420)`}>
        <ellipse cx="400" cy="380" rx="35" ry="50" className="fur-outline" />
      </g>
    </svg>
  );
}

// 키프레임 애니메이션 헬퍼
function animateValues(
  keyframes: { time: number; value: number }[],
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
) {
  const startTime = performance.now();

  function tick() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);

    let value = keyframes[0].value;
    for (let i = 0; i < keyframes.length - 1; i++) {
      const current = keyframes[i];
      const next = keyframes[i + 1];
      if (progress >= current.time && progress <= next.time) {
        const localProgress = (progress - current.time) / (next.time - current.time);
        value = current.value + (next.value - current.value) * localProgress;
        break;
      } else if (progress > next.time) {
        value = next.value;
      }
    }

    onUpdate(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  }

  requestAnimationFrame(tick);
}

export default function CharacterSvgAnimation() {
  const [props, setProps] = useState<CharacterProps>({
    leftEyeScaleY: 1,
    rightEyeScaleY: 1,
    rightArmRotation: 0,
    leftEarRotation: 0,
    rightEarRotation: 0,
  });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isEarWiggling, setIsEarWiggling] = useState(false);

  // 눈 깜박임 애니메이션
  const playBlink = useCallback(() => {
    if (isBlinking) return;
    setIsBlinking(true);

    const blinkKeyframes = [
      { time: 0, value: 1 },
      { time: 0.05, value: 0.1 },
      { time: 0.1, value: 1 },
      { time: 0.6, value: 1 },
      { time: 0.65, value: 0.1 },
      { time: 0.7, value: 1 },
      { time: 1, value: 1 },
    ];

    animateValues(blinkKeyframes, 1.2, (value) => {
      setProps((prev) => ({
        ...prev,
        leftEyeScaleY: value,
        rightEyeScaleY: value,
      }));
    }, () => {
      setIsBlinking(false);
    });
  }, [isBlinking]);

  // 손 흔들기 애니메이션
  const playWave = useCallback(() => {
    if (isWaving) return;
    setIsWaving(true);

    const armKeyframes = [
      { time: 0, value: 0 },
      { time: 0.15, value: -35 },
      { time: 0.25, value: -20 },
      { time: 0.35, value: -35 },
      { time: 0.45, value: -20 },
      { time: 0.55, value: -35 },
      { time: 0.75, value: 0 },
      { time: 1, value: 0 },
    ];

    animateValues(armKeyframes, 1.5, (value) => {
      setProps((prev) => ({
        ...prev,
        rightArmRotation: value,
      }));
    }, () => {
      setIsWaving(false);
    });
  }, [isWaving]);

  // 귀 흔들기 애니메이션
  const playEarWiggle = useCallback(() => {
    if (isEarWiggling) return;
    setIsEarWiggling(true);

    const leftEarKeyframes = [
      { time: 0, value: 0 },
      { time: 0.1, value: -8 },
      { time: 0.2, value: 5 },
      { time: 0.3, value: -6 },
      { time: 0.4, value: 4 },
      { time: 0.5, value: -3 },
      { time: 0.6, value: 0 },
      { time: 1, value: 0 },
    ];

    const rightEarKeyframes = [
      { time: 0, value: 0 },
      { time: 0.1, value: 8 },
      { time: 0.2, value: -5 },
      { time: 0.3, value: 6 },
      { time: 0.4, value: -4 },
      { time: 0.5, value: 3 },
      { time: 0.6, value: 0 },
      { time: 1, value: 0 },
    ];

    animateValues(leftEarKeyframes, 1, (value) => {
      setProps((prev) => ({
        ...prev,
        leftEarRotation: value,
      }));
    });

    animateValues(rightEarKeyframes, 1, (value) => {
      setProps((prev) => ({
        ...prev,
        rightEarRotation: value,
      }));
    }, () => {
      setIsEarWiggling(false);
    });
  }, [isEarWiggling]);

  const playAll = useCallback(() => {
    playBlink();
    playWave();
    playEarWiggle();
  }, [playBlink, playWave, playEarWiggle]);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
        SVG 캐릭터 애니메이션
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        순수 React + 키프레임 보간
      </p>

      {/* 캐릭터 */}
      <div className="flex justify-center mb-6 bg-gradient-to-b from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800 rounded-xl p-6">
        <CharacterSVG
          leftEyeScaleY={props.leftEyeScaleY}
          rightEyeScaleY={props.rightEyeScaleY}
          rightArmRotation={props.rightArmRotation}
          leftEarRotation={props.leftEarRotation}
          rightEarRotation={props.rightEarRotation}
        />
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={playBlink}
          disabled={isBlinking}
          className={`px-3 py-2 text-white text-sm rounded-lg transition-colors ${isBlinking
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-amber-500 hover:bg-amber-600"
            }`}
        >
          {isBlinking ? "..." : "눈 깜박임"}
        </button>
        <button
          onClick={playWave}
          disabled={isWaving}
          className={`px-3 py-2 text-white text-sm rounded-lg transition-colors ${isWaving
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-600"
            }`}
        >
          {isWaving ? "..." : "손 흔들기"}
        </button>
        <button
          onClick={playEarWiggle}
          disabled={isEarWiggling}
          className={`px-3 py-2 text-white text-sm rounded-lg transition-colors ${isEarWiggling
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600"
            }`}
        >
          {isEarWiggling ? "..." : "귀 흔들기"}
        </button>
        <button
          onClick={playAll}
          disabled={isBlinking || isWaving || isEarWiggling}
          className={`px-3 py-2 text-white text-sm rounded-lg transition-colors ${isBlinking || isWaving || isEarWiggling
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-violet-500 hover:bg-violet-600"
            }`}
        >
          전체 재생
        </button>
      </div>
    </div>
  );
}
