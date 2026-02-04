"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as PIXI from "pixi.js";

type GameState = "menu" | "playing" | "paused" | "gameover";

interface Rock {
  sprite: PIXI.Sprite;
  x: number;
  y: number;
  speed: number;
  rotationSpeed: number;
  scale: number;
}

export default function RiverPixiGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const robotRef = useRef<PIXI.Container | null>(null);
  const rocksRef = useRef<Rock[]>([]);
  const scoreRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const animationTimeRef = useRef(0);
  const rockTextureRef = useRef<PIXI.Texture | null>(null);

  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // 에셋 로드
  const loadAssets = useCallback(async () => {
    try {
      // 바위 텍스쳐 로드
      rockTextureRef.current = await PIXI.Assets.load("/obj/rock.png");
      setAssetsLoaded(true);
    } catch (error) {
      console.error("Failed to load assets:", error);
      // 폴백: 기본 그래픽 사용
      setAssetsLoaded(true);
    }
  }, []);

  // 로봇 생성 (실제 이미지 사용)
  const createRobot = useCallback(async (app: PIXI.Application) => {
    const robot = new PIXI.Container();
    
    // 원본 river/page.tsx 기준:
    // 컨테이너: w-128 h-128 (512x512px), -bottom-40 (160px 아래로)
    // 왼팔: top-32 (128px) -left-32 (-128px), w-80 (320px), origin-top-right
    // 오른팔: top-32 (128px) -right-32 (-128px), w-80 (320px), origin-top-left
    // 몸체: w-full h-full (512x512)

    try {
      // 로봇 이미지 로드
      const bodyTexture = await PIXI.Assets.load("/robot/robot_body.png");
      const leftArmTexture = await PIXI.Assets.load("/robot/robot_left_arm.png");
      const rightArmTexture = await PIXI.Assets.load("/robot/robot_right_arm.png");

      // 몸체 (먼저 추가해서 뒤에 배치)
      const body = new PIXI.Sprite(bodyTexture);
      body.anchor.set(0.5);
      // 원본 크기 유지하거나 적절히 조정
      const bodyScale = 0.8;
      body.scale.set(bodyScale);

      // 왼쪽 팔 (몸체 뒤에 - 먼저 추가)
      const leftArm = new PIXI.Sprite(leftArmTexture);
      leftArm.anchor.set(1, 0); // origin-top-right (회전 기준점)
      const armScale = 0.5;
      leftArm.scale.set(armScale);
      // 위치: 몸체 왼쪽 어깨 부근
      leftArm.position.set(-80, -60);

      // 오른쪽 팔
      const rightArm = new PIXI.Sprite(rightArmTexture);
      rightArm.anchor.set(0, 0); // origin-top-left (회전 기준점)
      rightArm.scale.set(armScale);
      // 위치: 몸체 오른쪽 어깨 부근
      rightArm.position.set(80, -60);

      // 조립 (순서: 왼팔 -> 오른팔 -> 몸체, 나중에 추가된 것이 위에)
      robot.addChild(leftArm);
      robot.addChild(rightArm);
      robot.addChild(body);

      (robot as any).leftArm = leftArm;
      (robot as any).rightArm = rightArm;
      (robot as any).body = body;
      (robot as any).useImages = true;

      console.log("Robot images loaded successfully");

    } catch (error) {
      console.warn("Robot images not found, using graphics fallback:", error);

      // 폴백: 그래픽으로 로봇 생성
      const body = new PIXI.Graphics();
      body.roundRect(-50, -70, 100, 120, 15);
      body.fill(0x4a90d9);
      body.stroke({ width: 4, color: 0x2c5aa0 });

      const face = new PIXI.Graphics();
      face.roundRect(-35, -60, 70, 55, 10);
      face.fill(0x87ceeb);

      const leftEye = new PIXI.Graphics();
      leftEye.circle(-15, -35, 10);
      leftEye.fill(0x333333);
      leftEye.circle(-17, -38, 4);
      leftEye.fill(0xffffff);

      const rightEye = new PIXI.Graphics();
      rightEye.circle(15, -35, 10);
      rightEye.fill(0x333333);
      rightEye.circle(13, -38, 4);
      rightEye.fill(0xffffff);

      const mouth = new PIXI.Graphics();
      mouth.moveTo(-15, -10);
      mouth.quadraticCurveTo(0, 5, 15, -10);
      mouth.stroke({ width: 3, color: 0x333333 });

      const leftArm = new PIXI.Graphics();
      leftArm.roundRect(-30, -12, 60, 24, 10);
      leftArm.fill(0x4a90d9);
      leftArm.stroke({ width: 3, color: 0x2c5aa0 });
      leftArm.pivot.set(30, 0);
      leftArm.position.set(-50, -25);

      const rightArm = new PIXI.Graphics();
      rightArm.roundRect(-30, -12, 60, 24, 10);
      rightArm.fill(0x4a90d9);
      rightArm.stroke({ width: 3, color: 0x2c5aa0 });
      rightArm.pivot.set(-30, 0);
      rightArm.position.set(50, -25);

      robot.addChild(leftArm);
      robot.addChild(rightArm);
      robot.addChild(body);
      robot.addChild(face);
      robot.addChild(leftEye);
      robot.addChild(rightEye);
      robot.addChild(mouth);

      (robot as any).leftArm = leftArm;
      (robot as any).rightArm = rightArm;
      (robot as any).useImages = false;
    }

    robot.position.set(app.screen.width / 2, app.screen.height - 350);
    return robot;
  }, []);

  // 바위 생성 (실제 이미지 사용)
  const createRock = useCallback((app: PIXI.Application): Rock | null => {
    let sprite: PIXI.Sprite;

    if (rockTextureRef.current) {
      sprite = new PIXI.Sprite(rockTextureRef.current);
      sprite.anchor.set(0.5);
    } else {
      // 폴백: 그래픽으로 바위 생성
      const graphics = new PIXI.Graphics();
      const size = 40;
      graphics.moveTo(0, -size);
      graphics.lineTo(size * 0.7, -size * 0.5);
      graphics.lineTo(size * 0.9, size * 0.3);
      graphics.lineTo(size * 0.4, size * 0.8);
      graphics.lineTo(-size * 0.3, size * 0.7);
      graphics.lineTo(-size * 0.8, size * 0.2);
      graphics.lineTo(-size * 0.6, -size * 0.6);
      graphics.closePath();
      graphics.fill(0x696969);
      graphics.stroke({ width: 2, color: 0x404040 });

      const texture = app.renderer.generateTexture(graphics);
      sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5);
      graphics.destroy();
    }

    const scale = 0.3 + Math.random() * 0.3;
    sprite.scale.set(scale);

    return {
      sprite,
      x: 80 + Math.random() * (app.screen.width - 160),
      y: -100,
      speed: 3 + Math.random() * 4,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      scale,
    };
  }, []);

  // 물결 효과 생성
  const createWaterEffects = useCallback((app: PIXI.Application) => {
    const container = new PIXI.Container();

    for (let i = 0; i < 6; i++) {
      const wave = new PIXI.Graphics();
      wave.moveTo(0, 0);
      for (let x = 0; x <= app.screen.width + 100; x += 30) {
        wave.lineTo(x, Math.sin(x * 0.02) * 8);
      }
      wave.stroke({ width: 3, color: 0xffffff, alpha: 0.15 });
      wave.position.set(-50, (i + 1) * (app.screen.height / 7));
      (wave as any).waveIndex = i;
      container.addChild(wave);
    }

    return container;
  }, []);

  // 게임 초기화
  const initGame = useCallback(async () => {
    if (!containerRef.current) return;

    // 기존 앱 정리
    if (appRef.current) {
      appRef.current.destroy(true);
    }

    const app = new PIXI.Application();
    await app.init({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundAlpha: 0, // 투명 배경 (비디오가 보이도록)
      antialias: true,
    });

    containerRef.current.appendChild(app.canvas);
    appRef.current = app;

    // PixUS DevTool integration
    (globalThis as any).__PIXI_APP__ = app;

    // 물결 효과
    const waterEffects = createWaterEffects(app);
    app.stage.addChild(waterEffects);
    (app.stage as any).waterEffects = waterEffects;

    // 바위 컨테이너
    const rocksContainer = new PIXI.Container();
    app.stage.addChild(rocksContainer);
    (app.stage as any).rocksContainer = rocksContainer;

    // 로봇
    const robot = await createRobot(app);
    app.stage.addChild(robot);
    robotRef.current = robot;

    // 점수 텍스트
    const scoreText = new PIXI.Text({
      text: "점수: 0",
      style: {
        fontFamily: "Arial",
        fontSize: 28,
        fill: 0xffffff,
        fontWeight: "bold",
        dropShadow: {
          color: 0x000000,
          blur: 6,
          distance: 3,
        },
      },
    });
    scoreText.position.set(20, 20);
    app.stage.addChild(scoreText);
    (app.stage as any).scoreText = scoreText;

    // 초기화
    rocksRef.current = [];
    scoreRef.current = 0;
    setScore(0);

    // 비디오 재생
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  }, [createRobot, createWaterEffects]);

  // 게임 루프
  const gameLoop = useCallback(() => {
    const app = appRef.current;
    const robot = robotRef.current;
    if (!app || !robot) return;

    animationTimeRef.current += 0.05;
    const time = animationTimeRef.current;

    // 로봇 이동
    const speed = 10;
    if (keysRef.current.has("arrowleft") || keysRef.current.has("a")) {
      robot.x = Math.max(80, robot.x - speed);
    }
    if (keysRef.current.has("arrowright") || keysRef.current.has("d")) {
      robot.x = Math.min(app.screen.width - 80, robot.x + speed);
    }

    // 팔 수영 애니메이션
    const leftArm = (robot as any).leftArm;
    const rightArm = (robot as any).rightArm;
    const useImages = (robot as any).useImages;

    if (leftArm && rightArm) {
      // 원본: rotate 0 -> 90 -> 0 (2초 주기, easeInOut)
      // easeInOut 근사: (1 - cos(t)) / 2
      const armTime = time * Math.PI; // 2초 주기
      const easeValue = (1 - Math.cos(armTime)) / 2; // 0 -> 1 -> 0
      
      if (useImages) {
        // 이미지 사용 시: 왼팔 0~90도, 오른팔 0~-90도
        leftArm.rotation = easeValue * (Math.PI / 2); // 0 -> 90도 -> 0
        rightArm.rotation = -easeValue * (Math.PI / 2); // 0 -> -90도 -> 0
      } else {
        // 그래픽 사용 시 회전
        leftArm.rotation = easeValue * (Math.PI / 2.5);
        rightArm.rotation = -easeValue * (Math.PI / 2.5);
      }
    }

    // 로봇 위아래 흔들림 (원본: y [0, -30, 0], 2초 주기)
    const bobTime = time * Math.PI;
    const bobValue = (1 - Math.cos(bobTime)) / 2;
    robot.y = app.screen.height - 350 + bobValue * -30;

    // 물결 애니메이션
    const waterEffects = (app.stage as any).waterEffects as PIXI.Container;
    if (waterEffects) {
      waterEffects.children.forEach((wave) => {
        const index = (wave as any).waveIndex || 0;
        wave.position.x = Math.sin(time + index * 0.5) * 30 - 50;
      });
    }

    // 바위 생성 (확률적)
    if (Math.random() < 0.025) {
      const newRock = createRock(app);
      if (newRock) {
        const rocksContainer = (app.stage as any).rocksContainer as PIXI.Container;
        newRock.sprite.position.set(newRock.x, newRock.y);
        rocksContainer.addChild(newRock.sprite);
        rocksRef.current.push(newRock);
      }
    }

    // 바위 업데이트
    const rocksContainer = (app.stage as any).rocksContainer as PIXI.Container;
    rocksRef.current = rocksRef.current.filter((rock) => {
      rock.y += rock.speed;
      rock.sprite.position.y = rock.y;
      rock.sprite.rotation += rock.rotationSpeed;

      // 크기 약간 증가 (가까워지는 효과)
      const progress = rock.y / app.screen.height;
      rock.sprite.scale.set(rock.scale * (1 + progress * 0.3));

      // 화면 밖으로 나가면 제거 + 점수
      if (rock.y > app.screen.height + 100) {
        rocksContainer.removeChild(rock.sprite);
        rock.sprite.destroy();
        scoreRef.current += 10;
        setScore(scoreRef.current);
        return false;
      }

      // 충돌 체크
      const dx = rock.x - robot.x;
      const dy = rock.y - robot.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const collisionRadius = 50 + rock.scale * 60;

      if (distance < collisionRadius) {
        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current);
        }
        setGameState("gameover");
        return false;
      }

      return true;
    });

    // 점수 업데이트
    const scoreText = (app.stage as any).scoreText as PIXI.Text;
    if (scoreText) {
      scoreText.text = `점수: ${scoreRef.current}`;
    }

    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [createRock, gameState, highScore]);

  // 에셋 로드 및 게임 초기화 (마운트 시)
  useEffect(() => {
    (window as any).PIXI = PIXI; // PIXI 전역 노출
    loadAssets().then(() => {
      initGame(); // 에셋 로드 후 즉시 초기화 (DevTool 감지용)
    });
  }, [loadAssets, initGame]);

  // 게임 시작
  const startGame = useCallback(() => {
    setGameState("playing");
    animationTimeRef.current = 0;
    // 필요한 경우 점수/상태 리셋
    if (scoreRef.current > 0) {
      // 재시작인 경우 리셋 로직 필요? 
      // StartGame은 메뉴에서 호출됨. 메뉴는 처음에만? 
      // RestartGame이 따로 있음.
    }
  }, []);

  // 게임 재시작
  const restartGame = useCallback(async () => {
    // 기존 객체들이 있다면 정리보다 initGame 재호출이 깔끔함
    // 또는 상태만 리셋
    await initGame();
    setGameState("playing");
    animationTimeRef.current = 0;
  }, [initGame]);

  // 게임 루프 실행
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());

      if (e.key === "Escape" && gameState === "playing") {
        setGameState("paused");
      } else if (e.key === "Escape" && gameState === "paused") {
        setGameState("playing");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  // 비디오 일시정지/재생 처리
  useEffect(() => {
    if (videoRef.current) {
      if (gameState === "playing") {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [gameState]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 배경 비디오 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/bg/river_swimming.mp4"
        loop
        muted
        playsInline
      />

      {/* PixiJS 캔버스 컨테이너 */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* 메뉴 오버레이 */}
      {gameState === "menu" && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
          <div className="text-7xl mb-4">🏊</div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            River Swim
          </h1>
          <p className="text-2xl text-blue-300 mb-8">바위를 피해 수영하세요!</p>

          <button
            onClick={startGame}
            disabled={!assetsLoaded}
            className="px-10 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white text-2xl font-bold rounded-xl transition-all transform hover:scale-105 mb-4 shadow-lg"
          >
            {assetsLoaded ? "게임 시작" : "로딩 중..."}
          </button>

          {highScore > 0 && (
            <p className="text-yellow-400 text-xl">🏆 최고 점수: {highScore}</p>
          )}

          <div className="mt-8 text-gray-300 text-center text-lg">
            <p>← → 또는 A D: 좌우 이동</p>
            <p>ESC: 일시정지</p>
          </div>
        </div>
      )}

      {/* 일시정지 오버레이 */}
      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
          <div className="text-6xl mb-4">⏸️</div>
          <h2 className="text-5xl font-bold text-white mb-8">일시정지</h2>

          <div className="space-y-4">
            <button
              onClick={() => setGameState("playing")}
              className="w-52 px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg transition-colors"
            >
              계속하기
            </button>
            <button
              onClick={restartGame}
              className="w-52 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold rounded-lg transition-colors"
            >
              다시 시작
            </button>
            <button
              onClick={() => setGameState("menu")}
              className="w-52 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold rounded-lg transition-colors"
            >
              메뉴로
            </button>
          </div>

          <p className="mt-6 text-gray-300 text-xl">현재 점수: {score}</p>
        </div>
      )}

      {/* 게임오버 오버레이 */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
          <div className="text-7xl mb-4">💥</div>
          <h2 className="text-6xl font-bold text-red-500 mb-4">Game Over</h2>
          <p className="text-4xl text-white mb-2">점수: {score}</p>
          {score >= highScore && score > 0 && (
            <p className="text-2xl text-yellow-400 mb-6">🎉 새로운 최고 점수!</p>
          )}

          <div className="space-y-4 mt-4">
            <button
              onClick={restartGame}
              className="w-52 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-lg transition-colors"
            >
              다시 하기
            </button>
            <button
              onClick={() => setGameState("menu")}
              className="w-52 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold rounded-lg transition-colors"
            >
              메뉴로
            </button>
          </div>
        </div>
      )}

      {/* 게임 중 UI */}
      {gameState === "playing" && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setGameState("paused")}
            className="px-5 py-3 bg-black/50 hover:bg-black/70 text-white text-lg rounded-lg transition-colors"
          >
            ⏸️ 일시정지
          </button>
        </div>
      )}

      {/* 모바일 컨트롤 */}
      {gameState === "playing" && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 z-10">
          <button
            onTouchStart={() => keysRef.current.add("arrowleft")}
            onTouchEnd={() => keysRef.current.delete("arrowleft")}
            onMouseDown={() => keysRef.current.add("arrowleft")}
            onMouseUp={() => keysRef.current.delete("arrowleft")}
            onMouseLeave={() => keysRef.current.delete("arrowleft")}
            className="w-24 h-24 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center text-5xl text-white backdrop-blur-sm"
          >
            ←
          </button>
          <button
            onTouchStart={() => keysRef.current.add("arrowright")}
            onTouchEnd={() => keysRef.current.delete("arrowright")}
            onMouseDown={() => keysRef.current.add("arrowright")}
            onMouseUp={() => keysRef.current.delete("arrowright")}
            onMouseLeave={() => keysRef.current.delete("arrowright")}
            className="w-24 h-24 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center text-5xl text-white backdrop-blur-sm"
          >
            →
          </button>
        </div>
      )}
    </main>
  );
}
