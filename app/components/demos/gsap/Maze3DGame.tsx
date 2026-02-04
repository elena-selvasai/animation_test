"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Sky, Text } from "@react-three/drei";
import * as THREE from "three";

// 미로 맵 (0: 길, 1: 벽, 2: 시작, 3: 골인, 4: 코인)
const MAZE_MAP = [
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
];

const CELL_SIZE = 2;
const WALL_HEIGHT = 3;
const PLAYER_HEIGHT = 1.6;
const PLAYER_RADIUS = 0.3;
const MOVE_SPEED = 5;

type GameState = "menu" | "playing" | "complete";

interface GameProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  coins: Set<string>;
  setCoins: React.Dispatch<React.SetStateAction<Set<string>>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

// 벽돌 텍스쳐 생성 함수 (repeat 설정 가능)
function createBrickTexture(repeatX: number = 1, repeatY: number = 1.5): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // 배경 (시멘트/모르타르)
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(0, 0, 256, 256);

  // 벽돌 색상들 (자연스러운 변화를 위해)
  const brickColors = ["#9c4221", "#a44e2a", "#8b3a1d", "#b05a32", "#934525"];
  
  const brickWidth = 64;
  const brickHeight = 32;
  const mortarSize = 4;

  for (let row = 0; row < 8; row++) {
    const offset = row % 2 === 0 ? 0 : brickWidth / 2;
    
    for (let col = -1; col < 5; col++) {
      const x = col * brickWidth + offset;
      const y = row * brickHeight;

      // 랜덤 벽돌 색상
      const color = brickColors[Math.floor(Math.random() * brickColors.length)];
      ctx.fillStyle = color;
      ctx.fillRect(
        x + mortarSize / 2,
        y + mortarSize / 2,
        brickWidth - mortarSize,
        brickHeight - mortarSize
      );

      // 벽돌 하이라이트 (상단/좌측)
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(x + mortarSize / 2, y + mortarSize / 2, brickWidth - mortarSize, 2);
      ctx.fillRect(x + mortarSize / 2, y + mortarSize / 2, 2, brickHeight - mortarSize);

      // 벽돌 그림자 (하단/우측)
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(x + mortarSize / 2, y + brickHeight - mortarSize / 2 - 2, brickWidth - mortarSize, 2);
      ctx.fillRect(x + brickWidth - mortarSize / 2 - 2, y + mortarSize / 2, 2, brickHeight - mortarSize);

      // 약간의 노이즈 추가
      for (let i = 0; i < 20; i++) {
        const nx = x + mortarSize + Math.random() * (brickWidth - mortarSize * 2);
        const ny = y + mortarSize + Math.random() * (brickHeight - mortarSize * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
        ctx.fillRect(nx, ny, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  
  return texture;
}

// 상단 텍스쳐 생성 함수 (콘크리트/돌 느낌)
function createTopTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  // 베이스 색상
  ctx.fillStyle = "#5a5a5a";
  ctx.fillRect(0, 0, 128, 128);

  // 노이즈 추가
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const gray = 70 + Math.random() * 40;
    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  
  return texture;
}

// 벽 재질 배열 생성 함수
function createWallMaterials(): THREE.MeshStandardMaterial[] {
  // 측면용 벽돌 텍스쳐 (가로로 긴 면)
  const sideBrickTexture = createBrickTexture(1, 1.5);
  // 상/하단용 텍스쳐
  const topTexture = createTopTexture();

  const sideMaterial = new THREE.MeshStandardMaterial({
    map: sideBrickTexture,
    roughness: 0.9,
    metalness: 0.1,
  });

  const topMaterial = new THREE.MeshStandardMaterial({
    map: topTexture,
    roughness: 0.95,
    metalness: 0.05,
  });

  // Box face order: +X, -X, +Y, -Y, +Z, -Z
  // 우측, 좌측, 상단, 하단, 앞, 뒤
  return [
    sideMaterial,  // +X (우측)
    sideMaterial,  // -X (좌측)
    topMaterial,   // +Y (상단)
    topMaterial,   // -Y (하단)
    sideMaterial,  // +Z (앞)
    sideMaterial,  // -Z (뒤)
  ];
}

// 벽 컴포넌트
function Wall({ position, materials }: { position: [number, number, number]; materials: THREE.MeshStandardMaterial[] }) {
  return (
    <mesh position={position} castShadow receiveShadow material={materials}>
      <boxGeometry args={[CELL_SIZE, WALL_HEIGHT, CELL_SIZE]} />
    </mesh>
  );
}

// 코인 컴포넌트
function Coin({ position, id, onCollect }: { 
  position: [number, number, number]; 
  id: string;
  onCollect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleCollect = useCallback(() => {
    if (!collected) {
      setCollected(true);
      onCollect(id);
    }
  }, [collected, id, onCollect]);

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position} onClick={handleCollect}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
      <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// 골인 지점
function Goal({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.5, 0.15, 16, 32]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
      </mesh>
      <pointLight color="#10b981" intensity={2} distance={5} />
    </group>
  );
}

// 플레이어 컨트롤러
function Player({ gameState, setGameState, coins, setCoins, score, setScore }: GameProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);

  // 시작 위치 찾기
  const startPos = useMemo(() => {
    for (let z = 0; z < MAZE_MAP.length; z++) {
      for (let x = 0; x < MAZE_MAP[z].length; x++) {
        if (MAZE_MAP[z][x] === 2) {
          return { x: x * CELL_SIZE, z: z * CELL_SIZE };
        }
      }
    }
    return { x: CELL_SIZE, z: CELL_SIZE };
  }, []);

  // 골인 위치 찾기
  const goalPos = useMemo(() => {
    for (let z = 0; z < MAZE_MAP.length; z++) {
      for (let x = 0; x < MAZE_MAP[z].length; x++) {
        if (MAZE_MAP[z][x] === 3) {
          return { x: x * CELL_SIZE, z: z * CELL_SIZE };
        }
      }
    }
    return { x: 0, z: 0 };
  }, []);

  // 초기 카메라 위치 설정
  useEffect(() => {
    camera.position.set(startPos.x, PLAYER_HEIGHT, startPos.z);
  }, [camera, startPos]);

  // 키보드 이벤트
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          moveForward.current = true;
          break;
        case "KeyS":
        case "ArrowDown":
          moveBackward.current = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveLeft.current = true;
          break;
        case "KeyD":
        case "ArrowRight":
          moveRight.current = true;
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          moveForward.current = false;
          break;
        case "KeyS":
        case "ArrowDown":
          moveBackward.current = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveLeft.current = false;
          break;
        case "KeyD":
        case "ArrowRight":
          moveRight.current = false;
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [gameState]);

  // 충돌 체크
  const checkCollision = useCallback((x: number, z: number): boolean => {
    const gridX = Math.round(x / CELL_SIZE);
    const gridZ = Math.round(z / CELL_SIZE);

    // 주변 셀 체크
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const checkX = gridX + dx;
        const checkZ = gridZ + dz;

        if (checkZ >= 0 && checkZ < MAZE_MAP.length && checkX >= 0 && checkX < MAZE_MAP[0].length) {
          if (MAZE_MAP[checkZ][checkX] === 1) {
            const wallX = checkX * CELL_SIZE;
            const wallZ = checkZ * CELL_SIZE;
            const halfCell = CELL_SIZE / 2;

            if (
              x > wallX - halfCell - PLAYER_RADIUS &&
              x < wallX + halfCell + PLAYER_RADIUS &&
              z > wallZ - halfCell - PLAYER_RADIUS &&
              z < wallZ + halfCell + PLAYER_RADIUS
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }, []);

  // 코인 수집 체크
  const checkCoinCollision = useCallback((x: number, z: number) => {
    const gridX = Math.round(x / CELL_SIZE);
    const gridZ = Math.round(z / CELL_SIZE);
    const coinKey = `${gridX},${gridZ}`;

    if (coins.has(coinKey)) {
      const coinX = gridX * CELL_SIZE;
      const coinZ = gridZ * CELL_SIZE;
      const distance = Math.sqrt((x - coinX) ** 2 + (z - coinZ) ** 2);

      if (distance < 0.8) {
        setCoins((prev) => {
          const newCoins = new Set(prev);
          newCoins.delete(coinKey);
          return newCoins;
        });
        setScore((s) => s + 10);
      }
    }
  }, [coins, setCoins, setScore]);

  // 골인 체크
  const checkGoal = useCallback((x: number, z: number) => {
    const distance = Math.sqrt((x - goalPos.x) ** 2 + (z - goalPos.z) ** 2);
    if (distance < 1) {
      setGameState("complete");
    }
  }, [goalPos, setGameState]);

  useFrame((_, delta) => {
    if (gameState !== "playing" || !controlsRef.current?.isLocked) return;

    // 방향 계산
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.current.normalize();

    // 카메라 방향으로 이동
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

    velocity.current.set(0, 0, 0);
    velocity.current.addScaledVector(cameraDirection, direction.current.z * MOVE_SPEED * delta);
    velocity.current.addScaledVector(right, direction.current.x * MOVE_SPEED * delta);

    // 새 위치 계산
    const newX = camera.position.x + velocity.current.x;
    const newZ = camera.position.z + velocity.current.z;

    // 충돌 체크 후 이동
    if (!checkCollision(newX, camera.position.z)) {
      camera.position.x = newX;
    }
    if (!checkCollision(camera.position.x, newZ)) {
      camera.position.z = newZ;
    }

    // 코인 및 골인 체크
    checkCoinCollision(camera.position.x, camera.position.z);
    checkGoal(camera.position.x, camera.position.z);
  });

  // PointerLockControls의 lock/unlock 이벤트 처리
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleLock = () => {
      if (gameState === "menu") {
        setGameState("playing");
      }
    };

    const handleUnlock = () => {
      // unlock 시 필요한 처리 (선택적)
    };

    controls.addEventListener("lock", handleLock);
    controls.addEventListener("unlock", handleUnlock);

    return () => {
      controls.removeEventListener("lock", handleLock);
      controls.removeEventListener("unlock", handleUnlock);
    };
  }, [gameState, setGameState]);

  return <PointerLockControls ref={controlsRef} />;
}

// 미로 씬
function MazeScene(props: GameProps) {
  const { coins } = props;

  // 벽 재질 배열 생성 (한 번만)
  const wallMaterials = useMemo(() => createWallMaterials(), []);

  // 벽, 코인, 골인 위치 계산
  const { walls, coinPositions, goalPosition } = useMemo(() => {
    const walls: [number, number, number][] = [];
    const coinPositions: { pos: [number, number, number]; id: string }[] = [];
    let goalPosition: [number, number, number] = [0, 0, 0];

    MAZE_MAP.forEach((row, z) => {
      row.forEach((cell, x) => {
        const posX = x * CELL_SIZE;
        const posZ = z * CELL_SIZE;

        if (cell === 1) {
          walls.push([posX, WALL_HEIGHT / 2, posZ]);
        } else if (cell === 4) {
          coinPositions.push({ pos: [posX, 1, posZ], id: `${x},${z}` });
        } else if (cell === 3) {
          goalPosition = [posX, 1, posZ];
        }
      });
    });

    return { walls, coinPositions, goalPosition };
  }, []);

  const handleCoinCollect = useCallback((id: string) => {
    props.setCoins((prev) => {
      const newCoins = new Set(prev);
      newCoins.delete(id);
      return newCoins;
    });
    props.setScore((s) => s + 10);
  }, [props]);

  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[5 * CELL_SIZE, 5, 5 * CELL_SIZE]} intensity={0.5} color="#fff" />

      {/* 하늘 */}
      <Sky sunPosition={[100, 20, 100]} />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5 * CELL_SIZE, 0, 5 * CELL_SIZE]} receiveShadow>
        <planeGeometry args={[MAZE_MAP[0].length * CELL_SIZE + 4, MAZE_MAP.length * CELL_SIZE + 4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 벽 */}
      {walls.map((pos, i) => (
        <Wall key={i} position={pos} materials={wallMaterials} />
      ))}

      {/* 코인 */}
      {coinPositions.map(({ pos, id }) => 
        coins.has(id) && (
          <Coin key={id} position={pos} id={id} onCollect={handleCoinCollect} />
        )
      )}

      {/* 골인 */}
      <Goal position={goalPosition} />

      {/* 플레이어 */}
      <Player {...props} />
    </>
  );
}

// 메인 컴포넌트
export default function Maze3DGame() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [coins, setCoins] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const isLockingRef = useRef(false);

  // 코인 초기화
  useEffect(() => {
    const coinPositions = new Set<string>();
    MAZE_MAP.forEach((row, z) => {
      row.forEach((cell, x) => {
        if (cell === 4) {
          coinPositions.add(`${x},${z}`);
        }
      });
    });
    setCoins(coinPositions);
  }, []);

  // 게임 리셋
  const resetGame = useCallback(() => {
    const coinPositions = new Set<string>();
    MAZE_MAP.forEach((row, z) => {
      row.forEach((cell, x) => {
        if (cell === 4) {
          coinPositions.add(`${x},${z}`);
        }
      });
    });
    setCoins(coinPositions);
    setScore(0);
    setGameState("menu");
  }, []);

  // 안전한 Pointer Lock 요청
  const requestLock = useCallback(async () => {
    // 이미 락 요청 중이면 무시
    if (isLockingRef.current) return;
    
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    
    // 이미 락 상태면 무시
    if (document.pointerLockElement === canvas) return;
    
    isLockingRef.current = true;
    
    try {
      await canvas.requestPointerLock();
    } catch (error) {
      // SecurityError: 사용자가 ESC로 락을 해제하는 중이거나 이미 해제됨
      // 무시해도 됨 - 사용자가 다시 클릭하면 됨
    } finally {
      // 약간의 딜레이 후 플래그 해제 (연속 클릭 방지)
      setTimeout(() => {
        isLockingRef.current = false;
      }, 300);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 w-full rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          3D 미로 탈출 🎮
        </h3>
        <div className="flex gap-4 text-sm">
          <span className="text-amber-500 font-bold">💰 {score}</span>
          <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-xs">
            1인칭
          </span>
        </div>
      </div>

      {/* 3D 캔버스 */}
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-slate-900">
        <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }}>
          <MazeScene
            gameState={gameState}
            setGameState={setGameState}
            coins={coins}
            setCoins={setCoins}
            score={score}
            setScore={setScore}
          />
        </Canvas>

        {/* 메뉴 오버레이 */}
        {gameState === "menu" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-white text-2xl font-bold mb-2">3D 미로 탈출</h2>
            <p className="text-zinc-400 text-sm mb-6">1인칭 시점으로 미로를 탈출하세요!</p>
            <button
              onClick={requestLock}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
            >
              게임 시작 (클릭)
            </button>
            <div className="mt-6 text-zinc-500 text-xs text-center space-y-1">
              <p>WASD 또는 방향키: 이동</p>
              <p>마우스: 시점 회전</p>
              <p>ESC: 마우스 잠금 해제</p>
            </div>
          </div>
        )}

        {/* 완료 오버레이 */}
        {gameState === "complete" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-white text-2xl font-bold mb-2">클리어!</h2>
            <p className="text-amber-400 text-lg mb-6">획득 점수: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
            >
              다시 하기
            </button>
          </div>
        )}

        {/* 게임 중 UI */}
        {gameState === "playing" && (
          <>
            {/* 조준점 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 bg-white rounded-full opacity-70" />
            </div>
            {/* 미니맵 */}
            <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg">
              <div className="text-xs text-white mb-1">💎 x{coins.size} 남음</div>
              <div className="text-xs text-emerald-400">🚩 골인 찾기!</div>
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3">
        {gameState === "menu" 
          ? "화면을 클릭하여 게임을 시작하세요" 
          : gameState === "playing"
          ? "WASD 이동 | 마우스 시점 | ESC 해제 | 💎 수집 후 🚩 도착!"
          : "축하합니다!"}
      </p>
    </div>
  );
}
