"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
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

export default function RiverPixiContent() {
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
      rockTextureRef.current = await PIXI.Assets.load("/obj/rock.png");
      setAssetsLoaded(true);
    } catch (error) {
      console.error("Failed to load assets:", error);
      setAssetsLoaded(true);
    }
  }, []);

  // 로봇 생성
  const createRobot = useCallback(async (app: PIXI.Application) => {
    const robot = new PIXI.Container();

    try {
      const bodyTexture = await PIXI.Assets.load("/robot/robot_body.png");
      const leftArmTexture = await PIXI.Assets.load("/robot/robot_left_arm.png");
      const rightArmTexture = await PIXI.Assets.load("/robot/robot_right_arm.png");

      const body = new PIXI.Sprite(bodyTexture);
      body.anchor.set(0.5);
      body.scale.set(0.4);

      const leftArm = new PIXI.Sprite(leftArmTexture);
      leftArm.anchor.set(1, 0);
      leftArm.scale.set(0.25);
      leftArm.position.set(-40, -30);

      const rightArm = new PIXI.Sprite(rightArmTexture);
      rightArm.anchor.set(0, 0);
      rightArm.scale.set(0.25);
      rightArm.position.set(40, -30);

      robot.addChild(leftArm);
      robot.addChild(rightArm);
      robot.addChild(body);

      (robot as any).leftArm = leftArm;
      (robot as any).rightArm = rightArm;
      (robot as any).useImages = true;
    } catch (error) {
      // 폴백: 그래픽으로 로봇 생성
      const body = new PIXI.Graphics();
      body.roundRect(-25, -35, 50, 60, 8);
      body.fill(0x4a90d9);

      const leftEye = new PIXI.Graphics();
      leftEye.circle(-8, -18, 5);
      leftEye.fill(0xffffff);

      const rightEye = new PIXI.Graphics();
      rightEye.circle(8, -18, 5);
      rightEye.fill(0xffffff);

      const leftArm = new PIXI.Graphics();
      leftArm.roundRect(-15, -6, 30, 12, 5);
      leftArm.fill(0x4a90d9);
      leftArm.pivot.set(15, 0);
      leftArm.position.set(-25, -12);

      const rightArm = new PIXI.Graphics();
      rightArm.roundRect(-15, -6, 30, 12, 5);
      rightArm.fill(0x4a90d9);
      rightArm.pivot.set(-15, 0);
      rightArm.position.set(25, -12);

      robot.addChild(leftArm);
      robot.addChild(rightArm);
      robot.addChild(body);
      robot.addChild(leftEye);
      robot.addChild(rightEye);

      (robot as any).leftArm = leftArm;
      (robot as any).rightArm = rightArm;
      (robot as any).useImages = false;
    }

    robot.position.set(app.screen.width / 2, app.screen.height - 80);
    return robot;
  }, []);

  // 바위 생성
  const createRock = useCallback((app: PIXI.Application): Rock | null => {
    let sprite: PIXI.Sprite;

    if (rockTextureRef.current) {
      sprite = new PIXI.Sprite(rockTextureRef.current);
      sprite.anchor.set(0.5);
    } else {
      const graphics = new PIXI.Graphics();
      graphics.circle(0, 0, 20);
      graphics.fill(0x696969);
      const texture = app.renderer.generateTexture(graphics);
      sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5);
      graphics.destroy();
    }

    const scale = 0.15 + Math.random() * 0.15;
    sprite.scale.set(scale);

    return {
      sprite,
      x: 40 + Math.random() * (app.screen.width - 80),
      y: -50,
      speed: 2 + Math.random() * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      scale,
    };
  }, []);

  // 게임 초기화
  const initGame = useCallback(async () => {
    if (!containerRef.current) return;

    if (appRef.current) {
      appRef.current.destroy(true);
    }

    const app = new PIXI.Application();
    await app.init({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundAlpha: 0,
      antialias: true,
    });

    containerRef.current.appendChild(app.canvas);
    appRef.current = app;

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
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: "bold",
      },
    });
    scoreText.position.set(10, 10);
    app.stage.addChild(scoreText);
    (app.stage as any).scoreText = scoreText;

    rocksRef.current = [];
    scoreRef.current = 0;
    setScore(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  }, [createRobot]);

  // 게임 루프
  const gameLoop = useCallback(() => {
    const app = appRef.current;
    const robot = robotRef.current;
    if (!app || !robot) return;

    animationTimeRef.current += 0.05;
    const time = animationTimeRef.current;

    // 로봇 이동
    const speed = 5;
    if (keysRef.current.has("arrowleft") || keysRef.current.has("a")) {
      robot.x = Math.max(40, robot.x - speed);
    }
    if (keysRef.current.has("arrowright") || keysRef.current.has("d")) {
      robot.x = Math.min(app.screen.width - 40, robot.x + speed);
    }

    // 팔 애니메이션
    const leftArm = (robot as any).leftArm;
    const rightArm = (robot as any).rightArm;
    const useImages = (robot as any).useImages;

    if (leftArm && rightArm) {
      const armTime = time * Math.PI;
      const easeValue = (1 - Math.cos(armTime)) / 2;

      if (useImages) {
        leftArm.rotation = easeValue * (Math.PI / 2);
        rightArm.rotation = -easeValue * (Math.PI / 2);
      } else {
        leftArm.rotation = easeValue * (Math.PI / 2.5);
        rightArm.rotation = -easeValue * (Math.PI / 2.5);
      }
    }

    // 로봇 위아래 흔들림
    const bobTime = time * Math.PI;
    const bobValue = (1 - Math.cos(bobTime)) / 2;
    robot.y = app.screen.height - 80 + bobValue * -15;

    // 바위 생성
    if (Math.random() < 0.03) {
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

      const progress = rock.y / app.screen.height;
      rock.sprite.scale.set(rock.scale * (1 + progress * 0.3));

      if (rock.y > app.screen.height + 50) {
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
      const collisionRadius = 25 + rock.scale * 40;

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

  // 초기화
  useEffect(() => {
    loadAssets().then(() => initGame());
  }, [loadAssets, initGame]);

  const startGame = useCallback(() => {
    setGameState("playing");
    animationTimeRef.current = 0;
  }, []);

  const restartGame = useCallback(async () => {
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

  // 정리
  useEffect(() => {
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  // 비디오 컨트롤
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
    <div className="flex flex-col items-center w-full max-w-2xl">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold text-[#5B69E9]">River Swim - PixiJS</h1>
        <Link
          href="/river-pixi"
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          전체화면 →
        </Link>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-4">
        PixiJS를 사용한 바위 피하기 게임입니다.
      </p>

      {/* 게임 컨테이너 */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        {/* 배경 비디오 */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/bg/river_swimming.mp4"
          loop
          muted
          playsInline
        />

        {/* PixiJS 캔버스 */}
        <div ref={containerRef} className="absolute inset-0" />

        {/* 메뉴 오버레이 */}
        {gameState === "menu" && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
            <div className="text-4xl mb-2">🏊</div>
            <h2 className="text-2xl font-bold text-white mb-2">River Swim</h2>
            <p className="text-sm text-blue-300 mb-4">바위를 피해 수영하세요!</p>
            <button
              onClick={startGame}
              disabled={!assetsLoaded}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold rounded-lg transition-all"
            >
              {assetsLoaded ? "게임 시작" : "로딩..."}
            </button>
            {highScore > 0 && (
              <p className="text-yellow-400 text-sm mt-2">🏆 최고: {highScore}</p>
            )}
            <p className="text-gray-400 text-xs mt-4">← → 또는 A D: 이동</p>
          </div>
        )}

        {/* 일시정지 */}
        {gameState === "paused" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
            <div className="text-3xl mb-2">⏸️</div>
            <h2 className="text-xl font-bold text-white mb-4">일시정지</h2>
            <div className="space-y-2">
              <button
                onClick={() => setGameState("playing")}
                className="w-32 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
              >
                계속
              </button>
              <button
                onClick={restartGame}
                className="w-32 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg"
              >
                재시작
              </button>
            </div>
            <p className="text-gray-300 text-sm mt-4">점수: {score}</p>
          </div>
        )}

        {/* 게임오버 */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <div className="text-4xl mb-2">💥</div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over</h2>
            <p className="text-xl text-white mb-1">점수: {score}</p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 text-sm mb-4">🎉 최고 점수!</p>
            )}
            <div className="space-y-2">
              <button
                onClick={restartGame}
                className="w-32 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg"
              >
                다시 하기
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="w-32 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg"
              >
                메뉴로
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full">
        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          사용 기술
        </h4>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• PixiJS 2D 렌더링 엔진</li>
          <li>• WebGL 가속 그래픽</li>
          <li>• Sprite / Container / Graphics API</li>
          <li>• requestAnimationFrame 게임 루프</li>
        </ul>
      </div>
    </div>
  );
}
