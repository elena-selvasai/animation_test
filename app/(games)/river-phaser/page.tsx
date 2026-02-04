'use client';

import { useEffect, useRef, useState } from 'react';

export default function RiverPhaserPage() {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstanceRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 이미 게임이 있으면 생성하지 않음
        if (gameInstanceRef.current) return;

        let mounted = true;

        const initPhaser = async () => {
            if (!gameRef.current || !mounted) return;

            try {
                const Phaser = (await import('phaser')).default;

                const MOVE_SPEED = 5; // 이동 속도
                const SCREEN_PADDING = 100; // 화면 가장자리 여백

                class RiverScene extends Phaser.Scene {
                    private video!: Phaser.GameObjects.Video;
                    private rock!: Phaser.GameObjects.Image;
                    private robotContainer!: Phaser.GameObjects.Container;
                    private leftArm!: Phaser.GameObjects.Image;
                    private rightArm!: Phaser.GameObjects.Image;
                    private isLooping = false;
                    private initialWidth = 0;
                    private initialHeight = 0;
                    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
                    private keyA!: Phaser.Input.Keyboard.Key;
                    private keyD!: Phaser.Input.Keyboard.Key;
                    private robotBaseX = 0;

                    constructor() {
                        super('RiverScene');
                    }

                    preload() {
                        this.load.video('river', '/bg/river_swimming.mp4');
                        this.load.image('rock', '/obj/rock.png');
                        this.load.image('robot_body', '/robot/robot_body.png');
                        this.load.image('robot_left_arm', '/robot/robot_left_arm.png');
                        this.load.image('robot_right_arm', '/robot/robot_right_arm.png');
                    }

                    create() {
                        const { width, height } = this.scale;
                        this.initialWidth = width;
                        this.initialHeight = height;
                        const centerX = width / 2;
                        const centerY = height / 2;

                        // 1. Background Video
                        this.video = this.add.video(centerX, centerY, 'river');
                        this.video.setDisplaySize(width, height);
                        this.video.setMute(true);
                        this.video.setPlaybackRate(0.5);
                        this.video.play();

                        // 2. Rock Setup
                        this.rock = this.add.image(centerX, centerY, 'rock');
                        this.rock.setAlpha(0);
                        this.rock.setScrollFactor(0);
                        this.rock.displayWidth = 192;
                        this.rock.scaleY = this.rock.scaleX;

                        // 3. Robot Setup (river-pixi와 동일하게)
                        this.robotContainer = this.add.container(centerX, height - 350);
                        this.robotContainer.setSize(400, 400);

                        // Left Arm (위치: -80, -60, scale 0.5 비율)
                        this.leftArm = this.add.image(-80, -60, 'robot_left_arm');
                        this.leftArm.setScale(0.5);
                        this.leftArm.setOrigin(1, 0);

                        // Right Arm (위치: 80, -60, scale 0.5 비율)
                        this.rightArm = this.add.image(80, -60, 'robot_right_arm');
                        this.rightArm.setScale(0.5);
                        this.rightArm.setOrigin(0, 0);

                        // Body (scale 0.8 비율)
                        const body = this.add.image(0, 0, 'robot_body');
                        body.setScale(0.8);

                        this.robotContainer.add([this.leftArm, this.rightArm, body]);

                        // 로봇 초기 X 위치 저장
                        this.robotBaseX = centerX;

                        // 키보드 입력 설정
                        this.cursors = this.input.keyboard!.createCursorKeys();
                        this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
                        this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

                        // 조작 안내 텍스트
                        const helpText = this.add.text(16, height - 40, '← → 또는 A D: 로봇 이동', {
                            fontSize: '14px',
                            color: '#ffffff',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            padding: { x: 8, y: 4 }
                        });
                        helpText.setScrollFactor(0);
                        helpText.setDepth(100);

                        // Robot Animations (흔들림: 0 ~ -30px)
                        this.tweens.add({
                            targets: this.robotContainer,
                            y: { from: height - 350, to: height - 380 },
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });

                        this.tweens.add({
                            targets: this.leftArm,
                            angle: { from: 0, to: 90 },
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });

                        this.tweens.add({
                            targets: this.rightArm,
                            angle: { from: 0, to: -90 },
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                    }

                    update() {
                        if (!this.video) return;

                        const t = this.video.getProgress() * (this.video.getDuration() || 0);
                        const { width, height } = this.scale;

                        // 로봇 이동 처리
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
                            this.rock.x = (width / 2) + xOffset;
                            this.rock.y = (height / 2) + dropPx;
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
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundColor: '#000000',
                    scale: {
                        mode: Phaser.Scale.FIT,
                        autoCenter: Phaser.Scale.CENTER_BOTH
                    },
                    render: {
                        antialias: true,
                        pixelArt: false,
                        roundPixels: true,
                    },
                    scene: RiverScene
                };

                if (mounted && gameRef.current) {
                    gameInstanceRef.current = new Phaser.Game(config);
                    // Expose access for DevTools
                    (window as any).__PHASER_GAME__ = gameInstanceRef.current;
                }
            } catch (err) {
                console.error('Phaser initialization error:', err);
                setError('게임 초기화 실패');
            }
        };

        // 약간의 딜레이 후 초기화 (DOM 준비 대기)
        const timer = setTimeout(initPhaser, 100);

        return () => {
            mounted = false;
            clearTimeout(timer);

            if (gameInstanceRef.current) {
                try {
                    gameInstanceRef.current.destroy(true);
                } catch (e) {
                    console.warn('Game destroy error:', e);
                }
                gameInstanceRef.current = null;
                (window as any).__PHASER_GAME__ = null;
            }
        };
    }, []);

    if (error) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
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

    return <div ref={gameRef} className="w-full h-screen bg-black overflow-hidden" />;
}
