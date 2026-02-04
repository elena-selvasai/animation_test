"use client";

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "motion/react";
import Image from "next/image";
import { withBasePath } from "@/app/lib/constants";

const images = [
    withBasePath("/characters/character1 (1).svg"),
    withBasePath("/characters/character1 (2).svg"),
    withBasePath("/characters/character1 (3).svg"),
];

// 이미지 프리로딩 함수
const preloadImages = (imageUrls: string[]) => {
    imageUrls.forEach((url) => {
        const img = new window.Image();
        img.src = url;
    });
};

// 최적화된 이미지 프레임 컴포넌트
const ImageFrame = memo(({
    src,
    index,
    isActive
}: {
    src: string;
    index: number;
    isActive: boolean;
}) => {
    return (
        <motion.div
            initial={false}
            animate={{
                opacity: isActive ? 1 : 0,
            }}
            transition={{
                duration: 0.15,
                ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
                pointerEvents: isActive ? "auto" : "none",
                willChange: "opacity",
                transform: "translate3d(0, 0, 0)", // GPU 가속
            }}
        >
            <Image
                src={src}
                alt={`Character frame ${index + 1}`}
                width={200}
                height={200}
                priority={true}
                quality={100}
                loading="eager"
                draggable={false}
                style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                }}
            />
        </motion.div>
    );
});

ImageFrame.displayName = "ImageFrame";

export default function CharacterAnimation() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isJumping, setIsJumping] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const jumpControls = useAnimation();
    const videoRef = useRef<HTMLVideoElement>(null);

    // 이미지 프리로딩
    useEffect(() => {
        preloadImages(images);
        setImagesLoaded(true);
    }, []);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, []);

    useEffect(() => {
        // 이미지가 로드되지 않았거나 버튼이 보일 때는 애니메이션 정지
        if (!isPlaying || showButton || !imagesLoaded) return;

        const interval = setInterval(() => {
            nextImage();
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, showButton, nextImage, imagesLoaded]);

    const handleCharacterClick = async () => {
        // 이미 점프 중이거나 버튼이 보이면 무시
        if (isJumping || showButton) return;

        setIsJumping(true);

        // 점프 애니메이션 실행
        await jumpControls.start({
            y: [0, -80, 0],
            transition: {
                duration: 0.5,
                times: [0, 0.4, 1],
                ease: ["easeOut", "easeIn"],
            },
        });

        setIsJumping(false);
        // 점프 후 버튼 표시
        setShowButton(true);
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 캐릭터 클릭 이벤트 전파 방지
        setShowButton(false);
        
        // 비디오 초기화 (처음부터 다시 재생)
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    return (
        <div className="relative flex flex-col items-center" style={{ minHeight: "350px" }}>
            {/* 비디오 배경 */}
            <div 
                className="absolute rounded-2xl overflow-hidden"
                style={{
                    width: "500px",
                    height: "420px",
                    top: "-60px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 0,
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                        pointerEvents: "none",
                    }}
                >
                    <source src={withBasePath("/videos/856430-uhd_3840_2160_30fps.mp4")} type="video/mp4" />
                </video>
                {/* 비디오 위 오버레이 (캐릭터 가시성 향상) */}
                <div 
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {/* 캐릭터 */}
            <motion.div
                className="relative w-[200px] h-[200px] cursor-pointer select-none"
                onClick={handleCharacterClick}
                animate={jumpControls}
                style={{
                    willChange: "transform",
                    transform: "translate3d(0, 0, 0)", // GPU 가속
                    zIndex: 1,
                }}
            >
                {imagesLoaded && images.map((src, index) => (
                    <ImageFrame
                        key={src}
                        src={src}
                        index={index}
                        isActive={index === currentIndex}
                    />
                ))}
            </motion.div>

            {/* 화려한 버튼 with Expand Effect - Absolute Positioning */}
            <AnimatePresence>
                {showButton && (
                    <motion.div
                        className="absolute flex items-center justify-center"
                        style={{
                            top: "220px", // 캐릭터 바로 아래에 고정
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "200px", // 고정 너비
                            height: "60px", // 고정 높이
                            pointerEvents: "none", // 컨테이너는 클릭 방지
                        }}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 노란색 하이라이트 효과 - 펄스 */}
                        <motion.div
                            className="absolute rounded-full"
                            initial={{ scale: 1, opacity: 0 }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.6, 0.2, 0.6],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            style={{
                                background: "radial-gradient(ellipse, rgba(255, 215, 0, 0.7) 0%, rgba(255, 193, 7, 0.3) 50%, transparent 70%)",
                                width: "100%",
                                height: "100%",
                                filter: "blur(8px)",
                                pointerEvents: "none",
                            }}
                        />

                        {/* 노란색 하이라이트 효과 - 외곽 글로우 */}
                        <motion.div
                            className="absolute rounded-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{
                                scale: 1.4,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeOut",
                            }}
                            style={{
                                background: "radial-gradient(ellipse, rgba(255, 215, 0, 0.5) 0%, transparent 60%)",
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                            }}
                        />

                        {/* Expand 링 이펙트 - 첫 번째 (파란색) */}
                        <motion.div
                            className="absolute rounded-full"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                            }}
                            style={{
                                background: "radial-gradient(circle, rgba(102, 126, 234, 0.6) 0%, transparent 70%)",
                                left: "50%",
                                top: "50%",
                                width: "200px",
                                height: "60px",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        />
                        {/* Expand 링 이펙트 - 두 번째 (보라색) */}
                        <motion.div
                            className="absolute rounded-full"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: "easeOut",
                            }}
                            style={{
                                background: "radial-gradient(circle, rgba(240, 147, 251, 0.5) 0%, transparent 70%)",
                                left: "50%",
                                top: "50%",
                                width: "200px",
                                height: "60px",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        />
                        {/* 버튼 */}
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 1.2, 1],
                                opacity: 1,
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                                scale: {
                                    type: "tween",
                                    duration: 0.4,
                                    times: [0, 0.6, 1],
                                    ease: "easeOut",
                                },
                                opacity: { duration: 0.2 },
                            }}
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0 0 40px rgba(102, 126, 234, 0.9), 0 0 60px rgba(240, 147, 251, 0.6)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleButtonClick}
                            className="px-8 py-3 rounded-full font-bold text-white text-lg
                                       shadow-lg
                                       border-2 border-white/30
                                       relative overflow-hidden
                                       cursor-pointer"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                                boxShadow: "0 0 20px rgba(102, 126, 234, 0.5), 0 0 40px rgba(240, 147, 251, 0.3)",
                                pointerEvents: "auto", // 버튼은 클릭 가능
                                willChange: "transform", // GPU 가속
                            }}
                        >
                            <span className="relative z-10">✨ 계속하기 ✨</span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
