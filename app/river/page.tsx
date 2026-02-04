'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { motion } from "motion/react";

const MOVE_SPEED = 15; // 이동 속도 (px)
const SCREEN_PADDING = 100; // 화면 가장자리 여백

export default function RiverPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const rockRef = useRef<HTMLImageElement>(null);
    const [isLooping, setIsLooping] = useState(false);
    const [robotX, setRobotX] = useState(0); // 로봇 X 위치 오프셋
    const keysPressed = useRef<Set<string>>(new Set());

    // 키보드 이동 처리
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
                e.preventDefault();
                keysPressed.current.add(e.code);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.code);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // 이동 애니메이션 루프
    useEffect(() => {
        let animationId: number;

        const updatePosition = () => {
            const keys = keysPressed.current;
            let dx = 0;

            if (keys.has('ArrowLeft') || keys.has('KeyA')) dx -= MOVE_SPEED;
            if (keys.has('ArrowRight') || keys.has('KeyD')) dx += MOVE_SPEED;

            if (dx !== 0) {
                setRobotX(prev => {
                    const maxX = window.innerWidth / 2 - SCREEN_PADDING;
                    return Math.max(-maxX, Math.min(maxX, prev + dx));
                });
            }

            animationId = requestAnimationFrame(updatePosition);
        };

        animationId = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Set playback speed
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
        }
    }, []);

    // Sync animation loop
    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            const video = videoRef.current;
            const rock = rockRef.current;

            if (video && rock) {
                // Loop logic check (frame-perfect)
                if (isLooping && video.currentTime >= 8) {
                    video.currentTime = 5;
                }

                // Animation Logic
                if (video.currentTime >= 5 && video.currentTime <= 8) { // Active range including loop
                    rock.style.opacity = '1';

                    // Normalize time (0.0 to 1.0) for the 1 second movement (5s to 6s)
                    // But we want it to stay at bottom or handle the rest of the loop?
                    // The previous request said "move to bottom over 1 second".
                    // If it loops 4-8s (now 5-8s), what happens 6-8s? 
                    // Assuming it stays at bottom or floats further?
                    // Let's assume it completes the move by 6s and stays there or floats out.
                    // Let's make it continuous drift from 5s to 8s (loop duration).

                    // Re-reading prev request: "1회 재생 후 4초~8초 구간만 반복" (User changed to 5s in code).
                    // "5초정도... x값 -10%... 미세하게 점점 커지도록"
                    // "1초동안 화면 하단으로 이동하게도 해줘" (Move to bottom in 1s).

                    // Combine:
                    // 5s start.
                    // 5s -> 6s: Move quickly to bottom? Or just drift?
                    // "1초동안" implies duration = 1s.

                    const progress = video.currentTime - 5;

                    // Accelerating drop logic to exit screen
                    // Using t^2 acceleration for natural gravity/flow feel
                    // Target: Reach bottom (~45vh) around 1s mark, then continue off-screen
                    const dropAmount = Math.pow(progress, 2) * 45;

                    // Continuous Scale
                    const scale = 1 + progress * 0.05;

                    // Add subtle rotation for natural feel
                    const rotation = progress * 15; // Rotate continuously

                    // Add slight X drift
                    const xOffset = progress * 20; // Drift right continuously

                    rock.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${dropAmount}vh)) scale(${scale}) rotate(${rotation}deg)`;

                } else if (video.currentTime < 5) {
                    rock.style.opacity = '0';
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

        // Once the first full playback ends, switch to loop mode
        setIsLooping(true);
        video.currentTime = 5;
        video.play().catch(e => console.log('Replay error', e));
    };

    return (
        <main className="relative w-full h-screen overflow-hidden bg-black text-white">
            {/* Background Video */}
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
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
                alt="River Rock"
                className="absolute top-1/2 left-[40%] w-48 h-auto object-contain opacity-0 z-10 pointer-events-none transition-opacity duration-300"
                style={{ transform: 'translate(-50%, -50%)' }}
            />

            {/* Swimming Robot (river-pixi와 동일한 위치) */}
            <motion.div
                className="absolute bottom-[100px] left-1/2 z-20"
                style={{ width: "400px", height: "400px", x: `calc(-50% + ${robotX}px)` }}
                animate={{ y: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                {/* Left Arm - Behind Body */}
                <motion.img
                    src="/robot/robot_left_arm.png"
                    alt="Left Arm"
                    className="absolute origin-top-right"
                    style={{ top: "100px", left: "-40px", width: "200px", height: "auto" }}
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />

                {/* Right Arm */}
                <motion.img
                    src="/robot/robot_right_arm.png"
                    alt="Right Arm"
                    className="absolute origin-top-left"
                    style={{ top: "100px", right: "-40px", width: "200px", height: "auto" }}
                    animate={{ rotate: [0, -90, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />

                {/* Body - Top Z */}
                <img
                    src="/robot/robot_body.png"
                    alt="Robot Body"
                    className="relative z-10 w-full h-full object-contain"
                />
            </motion.div>

            {/* Overlay Content (Optional, for aesthetics) */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black/20 backdrop-blur-[2px] pointer-events-none">
                <h1 className="text-6xl md:text-8xl font-thin tracking-widest uppercase text-white/90 drop-shadow-lg">
                    River Flow
                </h1>
                <p className="mt-4 text-lg md:text-xl font-light tracking-wider text-white/80">
                    Immersive Experience
                </p>
            </div>

            {/* 조작 안내 UI */}
            <div className="absolute bottom-4 left-4 z-30 bg-black/50 text-white text-xs px-3 py-2 rounded-lg">
                <p>← → 또는 A D: 로봇 이동</p>
            </div>
        </main>
    );
}
