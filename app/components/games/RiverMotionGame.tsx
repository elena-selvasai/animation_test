"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { withBasePath } from "@/app/lib/constants";

interface RiverMotionGameProps {
  fullscreen?: boolean;
}

export default function RiverMotionGame({ fullscreen = false }: RiverMotionGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rockRef = useRef<HTMLImageElement>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [robotX, setRobotX] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());

  const MOVE_SPEED = fullscreen ? 15 : 10;
  const MAX_X = fullscreen ? (typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 400) : 200;

  // 키보드 이동 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(e.code)) {
        if (fullscreen) e.preventDefault();
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
  }, [fullscreen]);

  // 이동 애니메이션 루프
  useEffect(() => {
    let animationId: number;

    const updatePosition = () => {
      const keys = keysPressed.current;
      let dx = 0;

      if (keys.has("ArrowLeft") || keys.has("KeyA")) dx -= MOVE_SPEED;
      if (keys.has("ArrowRight") || keys.has("KeyD")) dx += MOVE_SPEED;

      if (dx !== 0) {
        setRobotX((prev) => Math.max(-MAX_X, Math.min(MAX_X, prev + dx)));
      }

      animationId = requestAnimationFrame(updatePosition);
    };

    animationId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationId);
  }, [MOVE_SPEED, MAX_X]);

  // 비디오 재생 속도
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  // 바위 애니메이션
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
          const dropAmount = Math.pow(progress, 2) * (fullscreen ? 45 : 30);
          const scale = 1 + progress * 0.05;
          const rotation = progress * 15;
          const xOffset = progress * (fullscreen ? 20 : 15);

          rock.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${dropAmount}${fullscreen ? 'vh' : '%'})) scale(${scale}) rotate(${rotation}deg)`;
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
  }, [isLooping, fullscreen]);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsLooping(true);
    video.currentTime = 5;
    video.play().catch((e) => console.log("Replay error", e));
  };

  // 크기 설정
  const robotSize = fullscreen ? "400px" : "200px";
  const armWidth = fullscreen ? "200px" : "100px";
  const armTop = fullscreen ? "100px" : "50px";
  const armLeft = fullscreen ? "-40px" : "-20px";
  const armRight = fullscreen ? "-40px" : "-20px";
  const robotBottom = fullscreen ? "100px" : "60px";
  const bobAmount = fullscreen ? -30 : -15;
  const rockWidth = fullscreen ? "w-48" : "w-24";

  return (
    <div className={`relative w-full ${fullscreen ? "h-screen" : "h-full aspect-video"} overflow-hidden bg-black`}>
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={withBasePath("/bg/river_swimming.mp4")}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
      />

      {/* Rock Overlay */}
      <img
        ref={rockRef}
        src={withBasePath("/obj/rock.png")}
        alt="Rock"
        className={`absolute top-1/2 left-[40%] ${rockWidth} h-auto object-contain opacity-0 z-10 pointer-events-none ${fullscreen ? "transition-opacity duration-300" : ""}`}
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Robot */}
      <motion.div
        className={`absolute left-1/2 z-20`}
        style={{ 
          width: robotSize, 
          height: robotSize, 
          bottom: robotBottom,
          x: `calc(-50% + ${robotX}px)` 
        }}
        animate={{ y: [0, bobAmount, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <motion.img
          src={withBasePath("/robot/robot_left_arm.png")}
          alt="Left Arm"
          className="absolute origin-top-right"
          style={{ top: armTop, left: armLeft, width: armWidth, height: "auto" }}
          animate={{ rotate: [0, 90, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <motion.img
          src={withBasePath("/robot/robot_right_arm.png")}
          alt="Right Arm"
          className="absolute origin-top-left"
          style={{ top: armTop, right: armRight, width: armWidth, height: "auto" }}
          animate={{ rotate: [0, -90, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <img
          src={withBasePath("/robot/robot_body.png")}
          alt="Robot Body"
          className="relative z-10 w-full h-full object-contain"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 pointer-events-none">
        <h2 className={`${fullscreen ? "text-6xl md:text-8xl" : "text-3xl"} font-thin tracking-widest uppercase text-white/90 drop-shadow-lg`}>
          River Flow
        </h2>
        {fullscreen && (
          <p className="mt-4 text-lg md:text-xl font-light tracking-wider text-white/80">
            Immersive Experience
          </p>
        )}
      </div>

      {/* 조작 안내 */}
      <div className={`absolute ${fullscreen ? "bottom-4 left-4 text-xs px-3 py-2" : "bottom-2 left-2 text-[10px] px-2 py-1"} bg-black/50 text-white rounded z-30`}>
        ← → 또는 A D: 로봇 이동
      </div>
    </div>
  );
}
