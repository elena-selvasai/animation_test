"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";

const MOVE_SPEED = 10;

export default function RiverContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rockRef = useRef<HTMLImageElement>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [robotX, setRobotX] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());

  // 키보드 이동 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(e.code)) {
        keysPressed.current.add(e.code);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 이동 애니메이션 루프
  useEffect(() => {
    let animationId: number;

    const updatePosition = () => {
      const keys = keysPressed.current;
      let dx = 0;

      if (keys.has("ArrowLeft") || keys.has("KeyA")) dx -= MOVE_SPEED;
      if (keys.has("ArrowRight") || keys.has("KeyD")) dx += MOVE_SPEED;

      if (dx !== 0) {
        setRobotX((prev) => {
          const maxX = 200;
          return Math.max(-maxX, Math.min(maxX, prev + dx));
        });
      }

      animationId = requestAnimationFrame(updatePosition);
    };

    animationId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // 비디오 재생 속도
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  // 락 애니메이션
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const video = videoRef.current;
      const rock = rockRef.current;

      if (video && rock) {
        if (isLooping && video.currentTime >= 8) {
          video.currentTime = 5;
        }

        if (video.currentTime >= 5 && video.currentTime <= 8) {
          rock.style.opacity = "1";
          const progress = video.currentTime - 5;
          const dropAmount = Math.pow(progress, 2) * 30;
          const scale = 1 + progress * 0.05;
          const rotation = progress * 15;
          const xOffset = progress * 15;

          rock.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${dropAmount}%)) scale(${scale}) rotate(${rotation}deg)`;
        } else if (video.currentTime < 5) {
          rock.style.opacity = "0";
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isLooping]);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsLooping(true);
    video.currentTime = 5;
    video.play().catch((e) => console.log("Replay error", e));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold text-[#5B69E9]">River Flow</h1>
        <Link
          href="/river"
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          전체화면 →
        </Link>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-4">
        Motion (Framer Motion)을 사용한 River 애니메이션입니다.
      </p>

      {/* 게임 컨테이너 */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg"
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/bg/river_swimming.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
        />

        {/* Rock Overlay */}
        <img
          ref={rockRef}
          src="/obj/rock.png"
          alt="Rock"
          className="absolute top-1/2 left-[40%] w-24 h-auto object-contain opacity-0 z-10 pointer-events-none"
          style={{ transform: "translate(-50%, -50%)" }}
        />

        {/* Robot */}
        <motion.div
          className="absolute bottom-[60px] left-1/2 z-20"
          style={{ width: "200px", height: "200px", x: `calc(-50% + ${robotX}px)` }}
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <motion.img
            src="/robot/robot_left_arm.png"
            alt="Left Arm"
            className="absolute origin-top-right"
            style={{ top: "50px", left: "-20px", width: "100px", height: "auto" }}
            animate={{ rotate: [0, 90, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <motion.img
            src="/robot/robot_right_arm.png"
            alt="Right Arm"
            className="absolute origin-top-left"
            style={{ top: "50px", right: "-20px", width: "100px", height: "auto" }}
            animate={{ rotate: [0, -90, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <img
            src="/robot/robot_body.png"
            alt="Robot Body"
            className="relative z-10 w-full h-full object-contain"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 pointer-events-none">
          <h2 className="text-3xl font-thin tracking-widest uppercase text-white/90 drop-shadow-lg">
            River Flow
          </h2>
        </div>

        {/* 조작 안내 */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
          ← → 또는 A D: 로봇 이동
        </div>
      </div>

      <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full">
        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          사용 기술
        </h4>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• Motion (Framer Motion) 애니메이션</li>
          <li>• HTML5 Video 배경</li>
          <li>• 키보드 인터랙션</li>
        </ul>
      </div>
    </div>
  );
}
