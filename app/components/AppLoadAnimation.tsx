"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AppLoadAnimationProps {
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
}

export default function AppLoadAnimation({
  width = 360,
  height = 640,
  autoPlay = true,
  loop = false,
}: AppLoadAnimationProps) {
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

  const scale = width / 360;

  useEffect(() => {
    if (!containerRef.current) return;

    // Create GSAP timeline
    const tl = gsap.timeline({
      paused: !autoPlay,
      repeat: loop ? -1 : 0,
      repeatDelay: 1,
      onComplete: () => setIsPlaying(false),
      onStart: () => setIsPlaying(true),
    });

    // Phase 1: Icon appears - scale up and rotate from -135deg to 0deg
    tl.fromTo(
      iconRef.current,
      {
        scale: 0.177, // 28.284 / 160 ≈ 0.177
        rotation: -135,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );

    // Phase 2: Icon moves up slightly
    tl.to(
      iconRef.current,
      {
        y: -36, // Move from 178px to 142px
        duration: 0.4,
        ease: "power2.inOut",
      },
      "+=0.2"
    );

    // Phase 3: Icon fades out
    tl.to(
      iconRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "+=0.3"
    );

    // Phase 4: Status bar fades in
    tl.to(
      statusBarRef.current,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.1"
    );

    // Phase 5: Form elements fade in with stagger
    tl.fromTo(
      [emailInputRef.current, passwordInputRef.current, buttonRef.current],
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // Phase 6: Email label animates
    tl.to(
      emailLabelRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      "+=0.3"
    );

    // Email value types in
    tl.to(
      emailValueRef.current,
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "+=0.1"
    );

    // Phase 7: Password label animates
    tl.to(
      passwordLabelRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      "+=0.2"
    );

    // Password value appears
    tl.to(
      passwordValueRef.current,
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "+=0.1"
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [autoPlay, loop]);

  const handleReplay = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[24px] shadow-xl"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "#5B69E9",
        }}
      >
        {/* Status Bar */}
        <div
          ref={statusBarRef}
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 opacity-0"
          style={{
            height: `${24 * scale}px`,
            backgroundColor: "#2E2EAB",
          }}
        >
          <span
            className="text-white font-normal opacity-90"
            style={{
              fontSize: `${13 * scale}px`,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            FIGMA
          </span>
          <span
            className="text-white font-normal opacity-90"
            style={{
              fontSize: `${13 * scale}px`,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            12:30
          </span>
          <div className="flex items-center gap-1">
            {/* WiFi Icon */}
            <svg
              width={16 * scale}
              height={12 * scale}
              viewBox="0 0 16 12"
              fill="white"
            >
              <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" />
              <path
                d="M4.5 7C5.5 5.5 6.5 5 8 5C9.5 5 10.5 5.5 11.5 7"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M2 4C4 2 6 1 8 1C10 1 12 2 14 4"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            {/* Signal Icon */}
            <svg
              width={12 * scale}
              height={12 * scale}
              viewBox="0 0 12 12"
              fill="white"
            >
              <rect x="0" y="8" width="2" height="4" rx="0.5" />
              <rect x="3" y="6" width="2" height="6" rx="0.5" />
              <rect x="6" y="4" width="2" height="8" rx="0.5" />
              <rect x="9" y="2" width="2" height="10" rx="0.5" />
            </svg>
            {/* Battery Icon */}
            <svg
              width={8 * scale}
              height={13 * scale}
              viewBox="0 0 8 13"
              fill="white"
            >
              <rect x="0" y="2" width="8" height="11" rx="1" />
              <rect x="2" y="0" width="4" height="2" rx="0.5" />
            </svg>
          </div>
        </div>

        {/* Mail Icon */}
        <div
          ref={iconRef}
          className="absolute flex items-center justify-center"
          style={{
            width: `${160 * scale}px`,
            height: `${160 * scale}px`,
            left: `${100 * scale}px`,
            top: `${178 * scale}px`,
            opacity: 0,
          }}
        >
          {/* Circle Background */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: `${120 * scale}px`,
              height: `${120 * scale}px`,
            }}
          />
          {/* Envelope Body */}
          <div
            className="absolute rounded-lg border-4 border-white"
            style={{
              width: `${67 * scale}px`,
              height: `${52 * scale}px`,
              background:
                "linear-gradient(92.14deg, #2E43FF 5.06%, #642EFF 89.13%)",
              top: `${54 * scale}px`,
              left: `${47 * scale}px`,
              borderRadius: `${8 * scale}px`,
            }}
          />
          {/* Envelope Top */}
          <svg
            className="absolute"
            style={{
              width: `${67.28 * scale}px`,
              height: `${31 * scale}px`,
              top: `${54 * scale}px`,
              left: `${46.86 * scale}px`,
            }}
            viewBox="0 0 67.2758 31"
            fill="none"
          >
            <path
              d="M8.01367 1.5H59.2627C65.9136 1.50029 68.2715 10.306 62.5107 13.6299L36.6475 28.5508C35.6777 29.1102 34.5447 29.5 33.6377 29.5C32.7307 29.4999 31.5976 29.1102 30.6279 28.5508L4.76563 13.6299C-0.99561 10.3061 1.3624 1.5 8.01367 1.5Z"
              fill="url(#envelope-gradient)"
              stroke="white"
              strokeWidth="3"
            />
            <defs>
              <linearGradient
                id="envelope-gradient"
                x1="-16.4309"
                y1="3.32143"
                x2="78.5654"
                y2="13.1713"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2E43FF" />
                <stop offset="1" stopColor="#642EFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Email Input */}
        <div
          ref={emailInputRef}
          className="absolute opacity-0"
          style={{
            width: `${327 * scale}px`,
            height: `${80 * scale}px`,
            left: `${16 * scale}px`,
            top: `${220 * scale}px`,
          }}
        >
          <div
            ref={emailLabelRef}
            className="text-white opacity-0"
            style={{
              fontSize: `${14 * scale}px`,
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.28px",
              marginBottom: `${8 * scale}px`,
              transform: "translateY(10px)",
            }}
          >
            Email Address
          </div>
          <div
            className="rounded-lg"
            style={{
              backgroundColor: "#6A77ED",
              height: `${48 * scale}px`,
              borderRadius: `${8 * scale}px`,
              padding: `${12 * scale}px ${14 * scale}px`,
            }}
          >
            <span
              ref={emailValueRef}
              className="text-white opacity-0"
              style={{
                fontSize: `${18 * scale}px`,
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.36px",
              }}
            >
              support@figma.com
            </span>
          </div>
        </div>

        {/* Password Input */}
        <div
          ref={passwordInputRef}
          className="absolute opacity-0"
          style={{
            width: `${327 * scale}px`,
            height: `${80 * scale}px`,
            left: `${16 * scale}px`,
            top: `${304 * scale}px`,
          }}
        >
          <div
            ref={passwordLabelRef}
            className="text-white opacity-0"
            style={{
              fontSize: `${14 * scale}px`,
              fontFamily: "Roboto, sans-serif",
              letterSpacing: "0.28px",
              marginBottom: `${8 * scale}px`,
              transform: "translateY(10px)",
            }}
          >
            Password
          </div>
          <div
            className="rounded-lg"
            style={{
              backgroundColor: "#6A77ED",
              height: `${48 * scale}px`,
              borderRadius: `${8 * scale}px`,
              padding: `${12 * scale}px ${14 * scale}px`,
            }}
          >
            <span
              ref={passwordValueRef}
              className="text-white opacity-0"
              style={{
                fontSize: `${18 * scale}px`,
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.36px",
              }}
            >
              •••••••••••••••••••••
            </span>
          </div>
        </div>

        {/* Sign In Button */}
        <div
          ref={buttonRef}
          className="absolute opacity-0 cursor-pointer hover:scale-105 transition-transform"
          style={{
            width: `${327 * scale}px`,
            height: `${56 * scale}px`,
            left: `${16 * scale}px`,
            top: `${544 * scale}px`,
          }}
        >
          <div
            className="flex items-center justify-center h-full bg-white"
            style={{
              borderRadius: `${100 * scale}px`,
            }}
          >
            <span
              className="font-medium"
              style={{
                fontSize: `${18 * scale}px`,
                fontFamily: "Roboto, sans-serif",
                letterSpacing: "0.36px",
                background:
                  "linear-gradient(102.06deg, #2E43FF 5.06%, #642EFF 89.13%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sign in
            </span>
          </div>
        </div>
      </div>

      {/* Replay Button */}
      <button
        onClick={handleReplay}
        disabled={isPlaying}
        className="px-4 py-2 bg-[#5B69E9] text-white rounded-lg hover:bg-[#4A58D8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        {isPlaying ? "재생 중..." : "다시 재생"}
      </button>
    </div>
  );
}
