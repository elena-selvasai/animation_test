"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";

// 1부터 40까지의 이미지 경로 생성
const generateTitleImages = () => {
    const images = [];
    for (let i = 1; i <= 40; i++) {
        images.push(`/title/title_motion_${String(i).padStart(2, '0')}.png`);
    }
    return images;
};

const titleImages = generateTitleImages();

// 이미지 프리로딩 함수
const preloadImages = (imageUrls: string[]) => {
    imageUrls.forEach((url) => {
        const img = new window.Image();
        img.src = url;
    });
};

// 최적화된 이미지 프레임 컴포넌트 - 깜박임 없는 버전
const TitleFrame = memo(({
    src,
    index,
    isActive,
    width = 400,
    height = 200
}: {
    src: string;
    index: number;
    isActive: boolean;
    width?: number;
    height?: number;
}) => {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
                opacity: isActive ? 1 : 0,
                visibility: isActive ? "visible" : "hidden",
                pointerEvents: isActive ? "auto" : "none",
                transform: "translate3d(0, 0, 0)", // GPU 가속
                transition: "none", // transition 완전 제거
                zIndex: isActive ? 10 : 0,
            }}
        >
            <Image
                src={src}
                alt={`Title frame ${index + 1}`}
                width={width}
                height={height}
                priority={index < 5} // 첫 5개 프레임만 우선 로딩
                quality={100}
                loading={index < 5 ? "eager" : "lazy"}
                draggable={false}
                unoptimized={false}
                style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    display: "block",
                }}
            />
        </div>
    );
});

TitleFrame.displayName = "TitleFrame";

interface TitleAnimationProps {
    width?: number;
    height?: number;
    fps?: number; // 초당 프레임 수 (기본: 24fps)
    loop?: boolean; // 반복 재생 여부 (기본: true)
    autoPlay?: boolean; // 자동 재생 여부 (기본: true)
    onComplete?: () => void; // 애니메이션 완료 시 콜백
    showControls?: boolean; // 컨트롤 버튼 표시 여부 (기본: false)
    showProgress?: boolean; // 진행도 표시 여부 (기본: false)
}

export default function TitleAnimation({
    width = 400,
    height = 200,
    fps = 24,
    loop = true,
    autoPlay = true,
    onComplete,
    showControls = false,
    showProgress = false
}: TitleAnimationProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    // 이미지 프리로딩
    useEffect(() => {
        preloadImages(titleImages);
        // 프리로딩 완료 후 약간의 딜레이를 두고 로드 완료 표시
        const timer = setTimeout(() => {
            setImagesLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const nextFrame = useCallback(() => {
        setCurrentIndex((prev) => {
            const nextIndex = prev + 1;

            // 마지막 프레임에 도달했을 때
            if (nextIndex >= titleImages.length) {
                if (loop) {
                    return 0; // 처음으로 돌아가기
                } else {
                    setIsPlaying(false);
                    if (!hasCompleted && onComplete) {
                        setHasCompleted(true);
                        onComplete();
                    }
                    return prev; // 마지막 프레임 유지
                }
            }

            return nextIndex;
        });
    }, [loop, onComplete, hasCompleted]);

    // 프레임 애니메이션
    useEffect(() => {
        if (!isPlaying || !imagesLoaded) return;

        const frameInterval = 1000 / fps; // fps에 따른 프레임 간격
        const interval = setInterval(() => {
            nextFrame();
        }, frameInterval);

        return () => clearInterval(interval);
    }, [isPlaying, imagesLoaded, fps, nextFrame]);

    // 재생/일시정지 토글
    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
        if (hasCompleted) {
            setHasCompleted(false);
            setCurrentIndex(0);
        }
    };

    // 처음부터 재생
    const restart = () => {
        setCurrentIndex(0);
        setIsPlaying(true);
        setHasCompleted(false);
    };

    return (
        <div className="flex flex-col items-center">
            {/* 타이틀 애니메이션 */}
            <div
                className="relative cursor-pointer select-none"
                onClick={togglePlay}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: "translate3d(0, 0, 0)", // GPU 가속
                    backfaceVisibility: "hidden", // 추가 최적화
                    WebkitBackfaceVisibility: "hidden", // Safari 지원
                }}
            >
                {imagesLoaded ? (
                    titleImages.map((src, index) => (
                        <TitleFrame
                            key={src}
                            src={src}
                            index={index}
                            isActive={index === currentIndex}
                            width={width}
                            height={height}
                        />
                    ))
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                        <span className="text-gray-500">로딩 중...</span>
                    </div>
                )}
            </div>

            {/* 컨트롤 버튼 (선택사항) */}
            {showControls && (
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={togglePlay}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {isPlaying ? "일시정지" : "재생"}
                    </button>
                    <button
                        onClick={restart}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        처음부터
                    </button>
                </div>
            )}

            {/* 진행도 표시 */}
            {showProgress && (
                <div className="w-full max-w-md mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>프레임: {currentIndex + 1} / {titleImages.length}</span>
                        <span>{Math.round((currentIndex / (titleImages.length - 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                            style={{ width: `${(currentIndex / (titleImages.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
