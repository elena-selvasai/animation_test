"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { withBasePath } from "@/app/lib/constants";

type GameState = "menu" | "playing" | "paused" | "gameover";

// 모듈 레벨 - React 리렌더링과 무관하게 유지
const pressedKeys = new Set<string>();

interface Rock {
  sprite: PIXI.Sprite;
  x: number;
  y: number;
  speed: number;
  rotationSpeed: number;
  scale: number;
}

interface RiverPixiGameProps {
  fullscreen?: boolean;
}

export default function RiverPixiGame({ fullscreen = false }: RiverPixiGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const robotRef = useRef<PIXI.Container | null>(null);
  const rocksRef = useRef<Rock[]>([]);
  const scoreRef = useRef(0);
  const animationTimeRef = useRef(0);
  const rockTextureRef = useRef<PIXI.Texture | null>(null);
  const gameStateRef = useRef<GameState>("menu");
  const highScoreRef = useRef(0);

  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // 에셋 로드 및 게임 초기화
  useEffect(() => {
    let mounted = true;
    
    (window as any).PIXI = PIXI;
    
    const init = async () => {
      // 에셋 로드
      try {
        rockTextureRef.current = await PIXI.Assets.load(withBasePath("/obj/rock.png"));
      } catch (error) {
        console.error("Failed to load rock texture:", error);
      }
      
      if (!mounted || !containerRef.current) return;
      
      setAssetsLoaded(true);
      
      // 게임 초기화
      const app = new PIXI.Application();
      await app.init({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        backgroundAlpha: 0,
        antialias: true,
      });
      
      if (!mounted) {
        app.destroy(true);
        return;
      }
      
      containerRef.current.appendChild(app.canvas);
      appRef.current = app;
      (globalThis as any).__PIXI_APP__ = app;
      
      // 물결 효과
      const waterContainer = new PIXI.Container();
      for (let i = 0; i < 6; i++) {
        const wave = new PIXI.Graphics();
        wave.moveTo(0, 0);
        for (let x = 0; x <= app.screen.width + 100; x += 30) {
          wave.lineTo(x, Math.sin(x * 0.02) * 8);
        }
        wave.stroke({ width: 3, color: 0xffffff, alpha: 0.15 });
        wave.position.set(-50, (i + 1) * (app.screen.height / 7));
        (wave as any).waveIndex = i;
        waterContainer.addChild(wave);
      }
      app.stage.addChild(waterContainer);
      (app.stage as any).waterEffects = waterContainer;
      
      // 바위 컨테이너
      const rocksContainer = new PIXI.Container();
      app.stage.addChild(rocksContainer);
      (app.stage as any).rocksContainer = rocksContainer;
      
      // 로봇 생성
      const robot = new PIXI.Container();
      try {
        const bodyTexture = await PIXI.Assets.load(withBasePath("/robot/robot_body.png"));
        const leftArmTexture = await PIXI.Assets.load(withBasePath("/robot/robot_left_arm.png"));
        const rightArmTexture = await PIXI.Assets.load(withBasePath("/robot/robot_right_arm.png"));
        
        const body = new PIXI.Sprite(bodyTexture);
        body.anchor.set(0.5);
        body.scale.set(fullscreen ? 0.8 : 0.5);
        
        const leftArm = new PIXI.Sprite(leftArmTexture);
        leftArm.anchor.set(1, 0);
        leftArm.scale.set(fullscreen ? 0.5 : 0.3);
        leftArm.position.set(fullscreen ? -80 : -50, fullscreen ? -60 : -40);
        
        const rightArm = new PIXI.Sprite(rightArmTexture);
        rightArm.anchor.set(0, 0);
        rightArm.scale.set(fullscreen ? 0.5 : 0.3);
        rightArm.position.set(fullscreen ? 80 : 50, fullscreen ? -60 : -40);
        
        robot.addChild(leftArm);
        robot.addChild(rightArm);
        robot.addChild(body);
        (robot as any).leftArm = leftArm;
        (robot as any).rightArm = rightArm;
        (robot as any).useImages = true;
      } catch {
        // Fallback graphics robot
        const scale = fullscreen ? 1 : 0.6;
        const body = new PIXI.Graphics();
        body.roundRect(-50 * scale, -70 * scale, 100 * scale, 120 * scale, 15 * scale);
        body.fill(0x4a90d9);
        
        const leftArm = new PIXI.Graphics();
        leftArm.roundRect(-30 * scale, -12 * scale, 60 * scale, 24 * scale, 10 * scale);
        leftArm.fill(0x4a90d9);
        leftArm.pivot.set(30 * scale, 0);
        leftArm.position.set(-50 * scale, -25 * scale);
        
        const rightArm = new PIXI.Graphics();
        rightArm.roundRect(-30 * scale, -12 * scale, 60 * scale, 24 * scale, 10 * scale);
        rightArm.fill(0x4a90d9);
        rightArm.pivot.set(-30 * scale, 0);
        rightArm.position.set(50 * scale, -25 * scale);
        
        robot.addChild(leftArm);
        robot.addChild(rightArm);
        robot.addChild(body);
        (robot as any).leftArm = leftArm;
        (robot as any).rightArm = rightArm;
        (robot as any).useImages = false;
      }
      
      const robotBaseY = fullscreen ? app.screen.height - 350 : app.screen.height - 150;
      robot.position.set(app.screen.width / 2, robotBaseY);
      app.stage.addChild(robot);
      robotRef.current = robot;
      
      // 점수 텍스트
      const scoreText = new PIXI.Text({
        text: "점수: 0",
        style: { fontFamily: "Arial", fontSize: fullscreen ? 28 : 18, fill: 0xffffff, fontWeight: "bold" },
      });
      scoreText.position.set(fullscreen ? 20 : 10, fullscreen ? 20 : 10);
      app.stage.addChild(scoreText);
      (app.stage as any).scoreText = scoreText;
      
      // 게임 루프 (ticker)
      const speed = fullscreen ? 10 : 6;
      const bobAmount = fullscreen ? -30 : -15;
      
      app.ticker.add(() => {
        if (!mounted) return;
        const currentRobot = robotRef.current;
        if (!currentRobot || gameStateRef.current !== "playing") return;
        
        animationTimeRef.current += 0.05;
        const time = animationTimeRef.current;
        
        // 로봇 이동
        if (pressedKeys.has("ArrowLeft") || pressedKeys.has("a")) {
          currentRobot.position.x = Math.max(80, currentRobot.position.x - speed);
        }
        if (pressedKeys.has("ArrowRight") || pressedKeys.has("d")) {
          currentRobot.position.x = Math.min(app.screen.width - 80, currentRobot.position.x + speed);
        }
        
        // 팔 애니메이션
        const leftArm = (currentRobot as any).leftArm;
        const rightArm = (currentRobot as any).rightArm;
        if (leftArm && rightArm) {
          const easeValue = (1 - Math.cos(time * Math.PI)) / 2;
          leftArm.rotation = easeValue * (Math.PI / 2);
          rightArm.rotation = -easeValue * (Math.PI / 2);
        }
        
        // 로봇 위아래 흔들림
        const bobValue = (1 - Math.cos(time * Math.PI)) / 2;
        currentRobot.position.y = robotBaseY + bobValue * bobAmount;
        
        // 물결 애니메이션
        const waves = (app.stage as any).waterEffects as PIXI.Container;
        if (waves) {
          waves.children.forEach((wave) => {
            wave.position.x = Math.sin(time + ((wave as any).waveIndex || 0) * 0.5) * 30 - 50;
          });
        }
        
        // 바위 생성
        if (Math.random() < 0.025) {
          let rockSprite: PIXI.Sprite;
          if (rockTextureRef.current) {
            rockSprite = new PIXI.Sprite(rockTextureRef.current);
            rockSprite.anchor.set(0.5);
          } else {
            const g = new PIXI.Graphics();
            g.circle(0, 0, 30);
            g.fill(0x696969);
            const tex = app.renderer.generateTexture(g);
            rockSprite = new PIXI.Sprite(tex);
            rockSprite.anchor.set(0.5);
            g.destroy();
          }
          const rockScale = (fullscreen ? 0.3 : 0.2) + Math.random() * (fullscreen ? 0.3 : 0.2);
          rockSprite.scale.set(rockScale);
          const rock: Rock = {
            sprite: rockSprite,
            x: 80 + Math.random() * (app.screen.width - 160),
            y: -100,
            speed: (fullscreen ? 3 : 2) + Math.random() * (fullscreen ? 4 : 3),
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            scale: rockScale,
          };
          rockSprite.position.set(rock.x, rock.y);
          rocksContainer.addChild(rockSprite);
          rocksRef.current.push(rock);
        }
        
        // 바위 업데이트
        rocksRef.current = rocksRef.current.filter((rock) => {
          rock.y += rock.speed;
          rock.sprite.position.y = rock.y;
          rock.sprite.rotation += rock.rotationSpeed;
          rock.sprite.scale.set(rock.scale * (1 + rock.y / app.screen.height * 0.3));
          
          if (rock.y > app.screen.height + 100) {
            rocksContainer.removeChild(rock.sprite);
            rock.sprite.destroy();
            scoreRef.current += 10;
            setScore(scoreRef.current);
            return false;
          }
          
          // 충돌 체크
          const dx = rock.x - currentRobot.position.x;
          const dy = rock.y - currentRobot.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < (fullscreen ? 50 : 30) + rock.scale * (fullscreen ? 60 : 40)) {
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              setHighScore(scoreRef.current);
            }
            gameStateRef.current = "gameover";
            setGameState("gameover");
            return false;
          }
          return true;
        });
        
        // 점수 표시
        const st = (app.stage as any).scoreText as PIXI.Text;
        if (st) st.text = `점수: ${scoreRef.current}`;
      });
      
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    };
    
    init();
    
    return () => {
      mounted = false;
      if (appRef.current) {
        try { appRef.current.destroy(true); } catch {}
        appRef.current = null;
      }
      robotRef.current = null;
      rocksRef.current = [];
    };
  }, [fullscreen]);

  const startGame = useCallback(() => {
    gameStateRef.current = "playing";
    setGameState("playing");
    animationTimeRef.current = 0;
  }, []);

  const restartGame = useCallback(() => {
    // 기존 바위 정리
    const app = appRef.current;
    if (app) {
      const rocksContainer = (app.stage as any).rocksContainer as PIXI.Container;
      if (rocksContainer) {
        rocksContainer.removeChildren();
      }
    }
    rocksRef.current = [];
    
    // 로봇 위치 초기화
    if (robotRef.current && app) {
      robotRef.current.position.x = app.screen.width / 2;
    }
    
    // 점수 초기화
    scoreRef.current = 0;
    setScore(0);
    animationTimeRef.current = 0;
    
    // 비디오 초기화
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
    
    gameStateRef.current = "playing";
    setGameState("playing");
  }, []);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 방향키는 그대로, 문자키는 소문자로 저장
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pressedKeys.add(key);

      if (e.key === "Escape" && gameStateRef.current === "playing") {
        gameStateRef.current = "paused";
        setGameState("paused");
      } else if (e.key === "Escape" && gameStateRef.current === "paused") {
        gameStateRef.current = "playing";
        setGameState("playing");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pressedKeys.delete(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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

  // UI 크기 클래스
  const titleSize = fullscreen ? "text-6xl" : "text-2xl";
  const subtitleSize = fullscreen ? "text-2xl" : "text-sm";
  const buttonSize = fullscreen ? "px-10 py-4 text-2xl" : "px-4 py-2 text-sm";
  const iconSize = fullscreen ? "text-7xl" : "text-4xl";
  const controlSize = fullscreen ? "w-24 h-24 text-5xl" : "w-12 h-12 text-2xl";

  return (
    <div className={`relative w-full ${fullscreen ? "h-screen" : "h-full min-h-[300px]"} overflow-hidden bg-black`}>
      {/* 배경 비디오 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={withBasePath("/bg/river_swimming.mp4")}
        loop
        muted
        playsInline
      />

      {/* PixiJS 캔버스 컨테이너 */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* 메뉴 오버레이 */}
      {gameState === "menu" && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
          <div className={`${iconSize} mb-2`}>🏊</div>
          <h1 className={`${titleSize} font-bold text-white mb-2 drop-shadow-lg`}>
            River Swim
          </h1>
          <p className={`${subtitleSize} text-blue-300 mb-4`}>바위를 피해 수영하세요!</p>

          <button
            onClick={startGame}
            disabled={!assetsLoaded}
            className={`${buttonSize} bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg`}
          >
            {assetsLoaded ? "게임 시작" : "로딩 중..."}
          </button>

          {highScore > 0 && (
            <p className={`text-yellow-400 mt-2 ${fullscreen ? "text-xl" : "text-xs"}`}>🏆 최고 점수: {highScore}</p>
          )}

          <div className={`mt-4 text-gray-300 text-center ${fullscreen ? "text-lg" : "text-xs"}`}>
            <p>← → 또는 A D: 좌우 이동</p>
            <p>ESC: 일시정지</p>
          </div>
        </div>
      )}

      {/* 일시정지 오버레이 */}
      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
          <div className={`${iconSize} mb-2`}>⏸️</div>
          <h2 className={`${titleSize} font-bold text-white mb-4`}>일시정지</h2>

          <div className="space-y-2">
            <button
              onClick={() => {
                gameStateRef.current = "playing";
                setGameState("playing");
              }}
              className={`w-full ${buttonSize} bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors`}
            >
              계속하기
            </button>
            <button
              onClick={restartGame}
              className={`w-full ${buttonSize} bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors`}
            >
              다시 시작
            </button>
            <button
              onClick={() => {
                gameStateRef.current = "menu";
                setGameState("menu");
              }}
              className={`w-full ${buttonSize} bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors`}
            >
              메뉴로
            </button>
          </div>

          <p className={`mt-4 text-gray-300 ${fullscreen ? "text-xl" : "text-sm"}`}>현재 점수: {score}</p>
        </div>
      )}

      {/* 게임오버 오버레이 */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
          <div className={`${iconSize} mb-2`}>💥</div>
          <h2 className={`${titleSize} font-bold text-red-500 mb-2`}>Game Over</h2>
          <p className={`${fullscreen ? "text-4xl" : "text-xl"} text-white mb-1`}>점수: {score}</p>
          {score >= highScore && score > 0 && (
            <p className={`${fullscreen ? "text-2xl" : "text-sm"} text-yellow-400 mb-2`}>🎉 새로운 최고 점수!</p>
          )}

          <div className="space-y-2 mt-2">
            <button
              onClick={restartGame}
              className={`w-full ${buttonSize} bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors`}
            >
              다시 하기
            </button>
            <button
              onClick={() => {
                gameStateRef.current = "menu";
                setGameState("menu");
              }}
              className={`w-full ${buttonSize} bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors`}
            >
              메뉴로
            </button>
          </div>
        </div>
      )}

      {/* 게임 중 UI */}
      {gameState === "playing" && (
        <div className={`absolute ${fullscreen ? "top-4 right-4" : "top-2 right-2"} z-10`}>
          <button
            onClick={() => {
              gameStateRef.current = "paused";
              setGameState("paused");
            }}
            className={`${fullscreen ? "px-5 py-3 text-lg" : "px-2 py-1 text-xs"} bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors`}
          >
            ⏸️ {fullscreen && "일시정지"}
          </button>
        </div>
      )}

      {/* 모바일 컨트롤 */}
      {gameState === "playing" && (
        <div className={`absolute ${fullscreen ? "bottom-8" : "bottom-2"} left-1/2 transform -translate-x-1/2 flex ${fullscreen ? "gap-6" : "gap-2"} z-10`}>
          <button
            onTouchStart={() => pressedKeys.add("ArrowLeft")}
            onTouchEnd={() => pressedKeys.delete("ArrowLeft")}
            onMouseDown={() => pressedKeys.add("ArrowLeft")}
            onMouseUp={() => pressedKeys.delete("ArrowLeft")}
            onMouseLeave={() => pressedKeys.delete("ArrowLeft")}
            className={`${controlSize} bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm`}
          >
            ←
          </button>
          <button
            onTouchStart={() => pressedKeys.add("ArrowRight")}
            onTouchEnd={() => pressedKeys.delete("ArrowRight")}
            onMouseDown={() => pressedKeys.add("ArrowRight")}
            onMouseUp={() => pressedKeys.delete("ArrowRight")}
            onMouseLeave={() => pressedKeys.delete("ArrowRight")}
            className={`${controlSize} bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
