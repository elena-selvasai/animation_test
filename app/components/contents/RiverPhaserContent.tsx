"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function RiverPhaserContent() {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gameInstanceRef.current) return;

    let mounted = true;

    const initPhaser = async () => {
      if (!gameRef.current || !mounted) return;

      try {
        const Phaser = (await import("phaser")).default;

        class RiverScene extends Phaser.Scene {
          private video!: Phaser.GameObjects.Video;
          private robotContainer!: Phaser.GameObjects.Container;
          private leftArm!: Phaser.GameObjects.Image;
          private rightArm!: Phaser.GameObjects.Image;
          private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
          private keyA!: Phaser.Input.Keyboard.Key;
          private keyD!: Phaser.Input.Keyboard.Key;

          constructor() {
            super("RiverScene");
          }

          preload() {
            this.load.video("river", "/bg/river_swimming.mp4");
            this.load.image("robot_body", "/robot/robot_body.png");
            this.load.image("robot_left_arm", "/robot/robot_left_arm.png");
            this.load.image("robot_right_arm", "/robot/robot_right_arm.png");
          }

          create() {
            const { width, height } = this.scale;
            const centerX = width / 2;
            const centerY = height / 2;

            // Background Video
            this.video = this.add.video(centerX, centerY, "river");
            this.video.setDisplaySize(width, height);
            this.video.setMute(true);
            this.video.setPlaybackRate(0.5);
            this.video.play();

            // Robot Setup
            this.robotContainer = this.add.container(centerX, height - 100);
            this.robotContainer.setSize(120, 120);

            this.leftArm = this.add.image(-25, -20, "robot_left_arm");
            this.leftArm.setScale(0.15);
            this.leftArm.setOrigin(1, 0);

            this.rightArm = this.add.image(25, -20, "robot_right_arm");
            this.rightArm.setScale(0.15);
            this.rightArm.setOrigin(0, 0);

            const body = this.add.image(0, 0, "robot_body");
            body.setScale(0.25);

            this.robotContainer.add([this.leftArm, this.rightArm, body]);

            // Keyboard
            this.cursors = this.input.keyboard!.createCursorKeys();
            this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

            // Animations
            this.tweens.add({
              targets: this.robotContainer,
              y: { from: height - 100, to: height - 110 },
              duration: 2000,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });

            this.tweens.add({
              targets: this.leftArm,
              angle: { from: 0, to: 90 },
              duration: 2000,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });

            this.tweens.add({
              targets: this.rightArm,
              angle: { from: 0, to: -90 },
              duration: 2000,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });
          }

          update() {
            if (!this.video) return;

            const { width } = this.scale;

            if (this.cursors && this.robotContainer) {
              const minX = 50;
              const maxX = width - 50;

              if (this.cursors.left.isDown || this.keyA.isDown) {
                this.robotContainer.x = Math.max(minX, this.robotContainer.x - 3);
              }
              if (this.cursors.right.isDown || this.keyD.isDown) {
                this.robotContainer.x = Math.min(maxX, this.robotContainer.x + 3);
              }
            }
          }
        }

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.WEBGL,
          parent: gameRef.current!,
          width: 640,
          height: 360,
          backgroundColor: "#000000",
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          scene: RiverScene,
        };

        if (mounted && gameRef.current) {
          gameInstanceRef.current = new Phaser.Game(config);
        }
      } catch (err) {
        console.error("Phaser initialization error:", err);
        setError("Phaser 초기화 실패");
      }
    };

    const timer = setTimeout(initPhaser, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);

      if (gameInstanceRef.current) {
        try {
          gameInstanceRef.current.destroy(true);
        } catch (e) {
          console.warn("Game destroy error:", e);
        }
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold text-[#5B69E9]">River - Phaser</h1>
        <Link
          href="/river-phaser"
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          전체화면 →
        </Link>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-4">
        Phaser 게임 엔진을 사용한 River 게임입니다.
      </p>

      {/* 게임 컨테이너 */}
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        {error ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            <p>{error}</p>
          </div>
        ) : (
          <div ref={gameRef} className="w-full h-full" />
        )}
      </div>

      <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full">
        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          사용 기술
        </h4>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• Phaser 3 게임 엔진</li>
          <li>• WebGL 렌더링</li>
          <li>• Tween 애니메이션</li>
          <li>• ← → 또는 A D: 로봇 이동</li>
        </ul>
      </div>
    </div>
  );
}
