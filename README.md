# Animation Sample App

다양한 애니메이션 라이브러리와 기법을 사용한 샘플 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4
- **Animation Libraries**: 
  - GSAP (GreenSock Animation Platform)
  - Motion (Framer Motion)
  - React Three Fiber + Three.js
  - PixiJS
  - Phaser

## 프로젝트 구조

```
app/
├── page.tsx                    # 메인 대시보드 (탭 기반 UI)
├── layout.tsx                  # 루트 레이아웃
├── globals.css                 # 글로벌 스타일
│
├── (games)/                    # 🎮 게임 페이지 (Route Group)
│   ├── maze/                   # 2D 미로 탈출 (/maze)
│   ├── maze-3d/                # 3D 1인칭 미로 (/maze-3d)
│   ├── river/                  # River Flow - Motion (/river)
│   ├── river-phaser/           # River - Phaser (/river-phaser)
│   └── river-pixi/             # River - PixiJS (/river-pixi)
│
├── components/
│   ├── contents/               # 📑 탭 콘텐츠 컴포넌트
│   │   ├── AppLoadContent      # 앱 로딩 데모
│   │   ├── AnimationContent    # 타이틀/캐릭터 애니메이션
│   │   ├── GsapExamplesContent # GSAP 예제 모음
│   │   ├── MotionExamplesContent # Motion 예제 모음
│   │   └── CharacterExamplesContent # SVG 캐릭터 애니메이션
│   │
│   ├── demos/                  # 🎨 데모/예제 컴포넌트
│   │   ├── gsap/               # GSAP 데모들
│   │   │   ├── BasicTweens     # 기본 Tween 애니메이션
│   │   │   ├── EasingDemo      # Easing 함수 데모
│   │   │   ├── TimelineDemo    # 타임라인 데모
│   │   │   ├── StaggerDemo     # Stagger 효과
│   │   │   ├── TextAnimation   # 텍스트 애니메이션
│   │   │   ├── SvgAnimation    # SVG 애니메이션
│   │   │   ├── MazeGame        # 2D 미로 게임 컴포넌트
│   │   │   └── Maze3DGame      # 3D 미로 게임 컴포넌트
│   │   │
│   │   ├── motion/             # Motion (Framer) 데모들
│   │   │   ├── BasicAnimations # 기본 애니메이션
│   │   │   ├── GesturesDemo    # 제스처 (드래그, 탭)
│   │   │   ├── VariantsDemo    # Variants 패턴
│   │   │   ├── LayoutDemo      # 레이아웃 애니메이션
│   │   │   ├── KeyframesDemo   # 키프레임 애니메이션
│   │   │   └── SpringDemo      # 스프링 물리
│   │   │
│   │   └── character/          # 캐릭터 데모
│   │       └── CharacterSvgAnimation # SVG 캐릭터
│   │
│   └── screens/                # 📱 앱 화면 컴포넌트
│       ├── LoginScreen         # 로그인 화면
│       ├── EmailListScreen     # 이메일 리스트 (Pull to Refresh)
│       ├── TitleAnimation      # CSS 타이틀 애니메이션
│       ├── TitleAnimationGSAP  # GSAP 타이틀 애니메이션
│       └── CharacterAnimation  # 캐릭터 애니메이션
│
├── lib/                        # 유틸리티
│   └── constants.ts            # 상수 정의
│
└── types/                      # 타입 정의
    └── index.ts
```

## 페이지 안내

### 메인 대시보드 (`/`)

탭 기반 UI로 다양한 애니메이션 데모를 탐색할 수 있습니다:

| 탭 | 설명 |
|---|---|
| 📱 앱 로딩 | 로그인 → 이메일 리스트 화면 전환 |
| 🎬 애니메이션 | CSS/GSAP 타이틀 + 캐릭터 애니메이션 |
| ✨ GSAP | GSAP 라이브러리 예제 모음 |
| 🎭 Motion | Framer Motion 예제 모음 |
| 🐰 캐릭터 | SVG 캐릭터 애니메이션 |

### 게임 페이지

| 경로 | 설명 | 기술 |
|-----|------|------|
| `/maze` | 2D 미로 탈출 | GSAP |
| `/maze-3d` | 1인칭 3D 미로 탈출 | React Three Fiber |
| `/river` | River Flow 애니메이션 | Motion (Framer) |
| `/river-phaser` | River 게임 | Phaser |
| `/river-pixi` | River 게임 | PixiJS |

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 조작법

### 미로 게임 (2D/3D)
- **이동**: WASD 또는 방향키
- **일시정지**: ESC
- **3D 시점**: 마우스 이동

### River 게임
- **로봇 이동**: ← → 또는 A D

## 라이선스

MIT
