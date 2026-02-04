"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/app/lib/constants";

interface RiverPhaserGameProps {
  fullscreen?: boolean;
}

export default function RiverPhaserGame({ fullscreen = false }: RiverPhaserGameProps) {
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

        const MOVE_SPEED = 5;
        const SCREEN_PADDING = 100;

        class RiverScene extends Phaser.Scene {
          private video!: Phaser.GameObjects.Video;
          private rock!: Phaser.GameObjects.Image;
          private robotContainer!: Phaser.GameObjects.Container;
          private leftArm!: Phaser.GameObjects.Image;
          private rightArm!: Phaser.GameObjects.Image;
          private isLooping = false;
          private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
          private keyA!: Phaser.Input.Keyboard.Key;
          private keyD!: Phaser.Input.Keyboard.Key;

          constructor() {
            super("RiverScene");
          }

          preload() {
            this.load.video("river", withBasePath("/bg/river_swimming.mp4"));
            this.load.image("rock", withBasePath("/obj/rock.png"));
            this.load.image("robot_body", withBasePath("/robot/robot_body.png"));
            this.load.image("robot_left_arm", withBasePath("/robot/robot_left_arm.png"));
            this.load.image("robot_right_arm", withBasePath("/robot/robot_right_arm.png"));
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

            // Rock Setup
            this.rock = this.add.image(centerX, centerY, "rock");
            this.rock.setAlpha(0);
            this.rock.setScrollFactor(0);
            this.rock.displayWidth = fullscreen ? 192 : 120;
            this.rock.scaleY = this.rock.scaleX;

            // Robot Setup
            const robotY = fullscreen ? height - 350 : height - 150;
            const robotScale = fullscreen ? 1 : 0.6;
            
            this.robotContainer = this.add.container(centerX, robotY);
            this.robotContainer.setSize(400 * robotScale, 400 * robotScale);

            this.leftArm = this.add.image(-80 * robotScale, -60 * robotScale, "robot_left_arm");
            this.leftArm.setScale(0.5 * robotScale);
            this.leftArm.setOrigin(1, 0);

            this.rightArm = this.add.image(80 * robotScale, -60 * robotScale, "robot_right_arm");
            this.rightArm.setScale(0.5 * robotScale);
            this.rightArm.setOrigin(0, 0);

            const body = this.add.image(0, 0, "robot_body");
            body.setScale(0.8 * robotScale);

            this.robotContainer.add([this.leftArm, this.rightArm, body]);

            // Keyboard
            this.cursors = this.input.keyboard!.createCursorKeys();
            this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

            // Help Text
            const fontSize = fullscreen ? "14px" : "10px";
            const helpText = this.add.text(16, height - 40, "← → 또는 A D: 로봇 이동", {
              fontSize,
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: { x: 8, y: 4 },
            });
            helpText.setScrollFactor(0);
            helpText.setDepth(100);

            // Robot Animations
            const bobAmount = fullscreen ? 30 : 15;
            this.tweens.add({
              targets: this.robotContainer,
              y: { from: robotY, to: robotY - bobAmount },
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

            const t = this.video.getProgress() * (this.video.getDuration() || 0);
            const { width, height } = this.scale;

            // Robot Movement
            if (this.cursors && this.robotContainer) {
              const minX = SCREEN_PADDING;
              const maxX = width - SCREEN_PADDING;

              if (this.cursors.left.isDown || this.keyA.isDown) {
                this.robotContainer.x = Math.max(minX, this.robotContainer.x - MOVE_SPEED);
              }
              if (this.cursors.right.isDown || this.keyD.isDown) {
                this.robotContainer.x = Math.min(maxX, this.robotContainer.x + MOVE_SPEED);
              }
            }

            // Video scaling
            if (this.video.width > 0) {
              const scale = Math.max(width / this.video.width, height / this.video.height);
              this.video.setScale(scale);
            }

            // Loop 5s-8s
            if (this.isLooping) {
              if (t >= 8) {
                this.video.seekTo(5);
              }
            } else {
              const duration = this.video.getDuration();
              if (duration > 0 && Math.abs(t - duration) < 0.5) {
                this.isLooping = true;
                this.video.seekTo(5);
                this.video.play();
              }
            }

            // Rock Logic
            if (t >= 5) {
              const progress = t - 5;
              const dropPx = Math.pow(progress, 2) * 0.45 * height;
              const xOffset = progress * 20;
              const scale = 1 + progress * 0.05;
              const rotation = progress * 15;

              this.rock.setAlpha(1);
              this.rock.x = width / 2 + xOffset;
              this.rock.y = height / 2 + dropPx;
              this.rock.setScale(scale);
              this.rock.setAngle(rotation);
            } else {
              this.rock.setAlpha(0);
            }
          }
        }

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.WEBGL,
          parent: gameRef.current!,
          width: fullscreen ? window.innerWidth : gameRef.current!.clientWidth,
          height: fullscreen ? window.innerHeight : gameRef.current!.clientHeight,
          backgroundColor: "#000000",
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          render: {
            antialias: true,
            pixelArt: false,
            roundPixels: true,
          },
          scene: RiverScene,
        };

        if (mounted && gameRef.current) {
          gameInstanceRef.current = new Phaser.Game(config);
          (window as any).__PHASER_GAME__ = gameInstanceRef.current;
        }
      } catch (err) {
        console.error("Phaser initialization error:", err);
        setError("게임 초기화 실패");
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
        (window as any).__PHASER_GAME__ = null;
      }
    };
  }, [fullscreen]);

  if (error) {
    return (
      <div className={`w-full ${fullscreen ? "h-screen" : "h-full aspect-video"} bg-black flex items-center justify-center`}>
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameRef}
      className={`w-full ${fullscreen ? "h-screen" : "h-full aspect-video"} bg-black overflow-hidden`}
    />
  );
}
