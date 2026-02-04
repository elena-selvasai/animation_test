"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";

// 난이도별 미로 맵 (0: 길, 1: 벽, 2: 시작, 3: 골인, 4: 코인)
const MAZE_MAPS = {
  easy: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 4, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 0, 1],
    [1, 4, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  normal: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 0, 4, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 4, 1, 0, 0, 4, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  hard: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 1, 0, 0, 0, 1, 4, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 4, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 4, 1],
    [1, 4, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 4, 1, 0, 0, 4, 0, 0, 0, 0, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

type Difficulty = "easy" | "normal" | "hard";
type GameState = "menu" | "playing" | "paused" | "complete";

const CELL_SIZE = 36;
const PLAYER_SIZE = 28;

const DIFFICULTY_INFO = {
  easy: { label: "쉬움", color: "bg-emerald-500", coins: 3 },
  normal: { label: "보통", color: "bg-amber-500", coins: 6 },
  hard: { label: "어려움", color: "bg-red-500", coins: 7 },
};

interface Position {
  x: number;
  y: number;
}

export default function MazeGame() {
  const playerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [gameState, setGameState] = useState<GameState>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [position, setPosition] = useState<Position>({ x: 1, y: 1 });
  const [coins, setCoins] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    normal: 0,
    hard: 0,
  });
  const isMovingRef = useRef(false);

  const currentMap = MAZE_MAPS[difficulty];

  // 메뉴 애니메이션
  useEffect(() => {
    if (gameState === "menu" && menuRef.current) {
      gsap.fromTo(
        menuRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.7)" }
      );
    }
  }, [gameState]);

  // 코인 초기화
  const initCoins = useCallback((map: number[][]) => {
    const coinPositions = new Set<string>();
    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 4) {
          coinPositions.add(`${x},${y}`);
        }
      });
    });
    setCoins(coinPositions);
  }, []);

  // 게임 시작
  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setPosition({ x: 1, y: 1 });
    setScore(0);
    setMoves(0);
    initCoins(MAZE_MAPS[diff]);
    setGameState("playing");

    // 시작 애니메이션
    setTimeout(() => {
      if (playerRef.current) {
        gsap.fromTo(
          playerRef.current,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }, 100);
  }, [initCoins]);

  // 이동 가능 여부 체크
  const canMove = useCallback((x: number, y: number): boolean => {
    if (x < 0 || x >= currentMap[0].length || y < 0 || y >= currentMap.length) {
      return false;
    }
    return currentMap[y][x] !== 1;
  }, [currentMap]);

  // 플레이어 이동
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isMovingRef.current || gameState !== "playing") return;

    const newX = position.x + dx;
    const newY = position.y + dy;

    if (!canMove(newX, newY)) {
      if (playerRef.current) {
        gsap.to(playerRef.current, {
          x: dx * 5,
          y: dy * 5,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        });
      }
      return;
    }

    isMovingRef.current = true;
    setMoves((m) => m + 1);

    if (playerRef.current) {
      gsap.to(playerRef.current, {
        left: newX * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2,
        top: newY * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          isMovingRef.current = false;
        },
      });
    }

    setPosition({ x: newX, y: newY });

    // 코인 수집
    const coinKey = `${newX},${newY}`;
    if (coins.has(coinKey)) {
      setCoins((prev) => {
        const newCoins = new Set(prev);
        newCoins.delete(coinKey);
        return newCoins;
      });
      setScore((s) => s + 10);

      const coinEl = document.getElementById(`coin-${coinKey}`);
      if (coinEl) {
        gsap.to(coinEl, {
          scale: 1.5,
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (playerRef.current) {
        gsap.fromTo(
          playerRef.current,
          { scale: 1 },
          { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 }
        );
      }
    }

    // 골인 체크
    if (currentMap[newY][newX] === 3) {
      const finalScore = score + (coins.has(coinKey) ? 10 : 0);
      setGameState("complete");
      
      // 최고 점수 업데이트
      setBestScores((prev) => ({
        ...prev,
        [difficulty]: Math.max(prev[difficulty], finalScore),
      }));
      
      celebrateWin();
    }
  }, [position, canMove, coins, gameState, currentMap, score, difficulty]);

  // 승리 축하 애니메이션
  const celebrateWin = () => {
    if (!containerRef.current) return;

    if (playerRef.current) {
      gsap.to(playerRef.current, {
        scale: 1.5,
        rotation: 360,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }

    for (let i = 0; i < 12; i++) {
      const star = document.createElement("div");
      star.innerHTML = "⭐";
      star.style.position = "absolute";
      star.style.left = "50%";
      star.style.top = "50%";
      star.style.fontSize = "20px";
      star.style.pointerEvents = "none";
      containerRef.current.appendChild(star);

      const angle = (i / 12) * Math.PI * 2;
      const distance = 80 + Math.random() * 40;

      gsap.fromTo(
        star,
        { x: 0, y: 0, scale: 0, opacity: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          scale: 1,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => star.remove(),
        }
      );
    }
  };

  // 메뉴로 돌아가기
  const goToMenu = () => {
    setGameState("menu");
    if (playerRef.current) {
      gsap.set(playerRef.current, { scale: 1, rotation: 0 });
    }
  };

  // 게임 일시정지/재개
  const togglePause = useCallback(() => {
    if (gameState === "playing") {
      setGameState("paused");
    } else if (gameState === "paused") {
      setGameState("playing");
    }
  }, [gameState]);

  // 게임 재시작
  const restartGame = () => {
    setPosition({ x: 1, y: 1 });
    setScore(0);
    setMoves(0);
    initCoins(currentMap);
    setGameState("playing");

    if (playerRef.current) {
      gsap.set(playerRef.current, {
        left: 1 * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2,
        top: 1 * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2,
        scale: 1,
        rotation: 0,
      });
    }
  };

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (gameState === "playing" || gameState === "paused") {
          togglePause();
        }
        return;
      }

      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer, gameState, togglePause]);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          미로 탈출 🏃
        </h3>
        {gameState !== "menu" && (
          <div className="flex gap-4 text-sm">
            <span className={`px-2 py-0.5 rounded text-white text-xs ${DIFFICULTY_INFO[difficulty].color}`}>
              {DIFFICULTY_INFO[difficulty].label}
            </span>
            <span className="text-amber-500 font-bold">💰 {score}</span>
            <span className="text-zinc-500">이동: {moves}</span>
          </div>
        )}
      </div>

      {/* 게임 컨테이너 */}
      <div
        ref={containerRef}
        className="relative mx-auto overflow-hidden rounded-lg"
        style={{
          width: currentMap[0].length * CELL_SIZE,
          height: currentMap.length * CELL_SIZE,
          backgroundColor: "#1a1a2e",
        }}
      >
        {/* 시작 메뉴 */}
        {gameState === "menu" && (
          <div
            ref={menuRef}
            className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center z-30"
          >
            <div className="text-4xl mb-2">🎮</div>
            <h2 className="text-white text-2xl font-bold mb-6">미로 탈출</h2>
            
            <div className="space-y-3 w-48">
              <p className="text-zinc-400 text-sm text-center mb-4">난이도 선택</p>
              {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => startGame(diff)}
                  className={`w-full py-3 rounded-lg text-white font-bold transition-transform hover:scale-105 active:scale-95 ${DIFFICULTY_INFO[diff].color}`}
                >
                  {DIFFICULTY_INFO[diff].label}
                  <span className="ml-2 text-xs opacity-80">
                    (💎 x{DIFFICULTY_INFO[diff].coins})
                  </span>
                  {bestScores[diff] > 0 && (
                    <div className="text-xs font-normal opacity-70">
                      최고: {bestScores[diff]}점
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 text-zinc-500 text-xs text-center">
              <p>방향키 또는 WASD로 이동</p>
              <p>ESC로 일시정지</p>
            </div>
          </div>
        )}

        {/* 맵 렌더링 */}
        {gameState !== "menu" && currentMap.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="absolute"
              style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              {cell === 1 && (
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600" />
              )}
              {cell === 0 && (
                <div className="w-full h-full bg-slate-900/50" />
              )}
              {cell === 2 && (
                <div className="w-full h-full bg-emerald-900/50 flex items-center justify-center text-xs text-emerald-400">
                  S
                </div>
              )}
              {cell === 3 && (
                <div className="w-full h-full bg-amber-900/50 flex items-center justify-center">
                  <span className="text-xl">🚩</span>
                </div>
              )}
              {cell === 4 && coins.has(`${x},${y}`) && (
                <div
                  id={`coin-${x},${y}`}
                  className="w-full h-full bg-slate-900/50 flex items-center justify-center"
                >
                  <span className="text-lg animate-pulse">💎</span>
                </div>
              )}
              {cell === 4 && !coins.has(`${x},${y}`) && (
                <div className="w-full h-full bg-slate-900/50" />
              )}
            </div>
          ))
        )}

        {/* 플레이어 */}
        {gameState !== "menu" && (
          <div
            ref={playerRef}
            className="absolute z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50"
            style={{
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              left: position.x * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2,
              top: position.y * CELL_SIZE + (CELL_SIZE - PLAYER_SIZE) / 2,
            }}
          >
            <span className="text-sm">😊</span>
          </div>
        )}

        {/* 일시정지 오버레이 */}
        {gameState === "paused" && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <div className="text-3xl mb-2">⏸️</div>
            <div className="text-white text-xl font-bold mb-4">일시정지</div>
            <div className="space-y-2">
              <button
                onClick={() => setGameState("playing")}
                className="w-40 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                계속하기
              </button>
              <button
                onClick={restartGame}
                className="w-40 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                다시 시작
              </button>
              <button
                onClick={goToMenu}
                className="w-40 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                메뉴로
              </button>
            </div>
          </div>
        )}

        {/* 완료 오버레이 */}
        {gameState === "complete" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-white text-xl font-bold mb-1">축하합니다!</div>
            <div className="text-amber-400 mb-4">
              점수: {score} | 이동: {moves}
            </div>
            <div className="space-y-2">
              <button
                onClick={restartGame}
                className="w-40 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                다시 하기
              </button>
              <button
                onClick={goToMenu}
                className="w-40 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                메뉴로
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 모바일 컨트롤 */}
      {(gameState === "playing" || gameState === "paused") && (
        <div className="mt-4 flex flex-col items-center gap-1">
          <button
            onClick={() => movePlayer(0, -1)}
            disabled={gameState !== "playing"}
            className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 active:scale-95 transition-all disabled:opacity-50"
          >
            ↑
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => movePlayer(-1, 0)}
              disabled={gameState !== "playing"}
              className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 active:scale-95 transition-all disabled:opacity-50"
            >
              ←
            </button>
            <button
              onClick={togglePause}
              className="w-12 h-12 bg-zinc-300 dark:bg-zinc-600 rounded-lg text-xl hover:bg-zinc-400 dark:hover:bg-zinc-500 active:scale-95 transition-all"
            >
              {gameState === "paused" ? "▶" : "⏸"}
            </button>
            <button
              onClick={() => movePlayer(1, 0)}
              disabled={gameState !== "playing"}
              className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 active:scale-95 transition-all disabled:opacity-50"
            >
              →
            </button>
          </div>
          <button
            onClick={() => movePlayer(0, 1)}
            disabled={gameState !== "playing"}
            className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 active:scale-95 transition-all disabled:opacity-50"
          >
            ↓
          </button>
        </div>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
        {gameState === "menu" 
          ? "난이도를 선택해서 게임을 시작하세요!"
          : "방향키/WASD 이동 | ESC 일시정지 | 💎 수집 후 🚩 도착!"}
      </p>
    </div>
  );
}
