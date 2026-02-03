"use client";

import { useState, useRef, useCallback } from "react";
import gsap from "gsap";

// basePath 설정 (production에서는 /animation-sample)
const basePath = process.env.NODE_ENV === 'production' ? '/animation-sample' : '';

interface WarmingUpScreenProps {
  width?: number;
  height?: number;
}

interface DragItem {
  id: string;
  type: "o" | "x";
  x: number;
  y: number;
  placed: boolean;
}

export default function WarmingUpScreen({
  width = 960,
  height = 540,
}: WarmingUpScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("warmingUp");
  const [dragItems, setDragItems] = useState<DragItem[]>([
    { id: "x1", type: "x", x: 0, y: 0, placed: false },
    { id: "o1", type: "o", x: 0, y: 60, placed: false },
  ]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  const scale = width / 960;

  const tabs = [
    { id: "warmingUp", label: "Warming up", active: true },
    { id: "checkPoint", label: "Check Point", active: false },
    { id: "myGoal", label: "My Goal", active: false },
    { id: "words", label: "Words", active: false },
  ];

  const navButtons = [
    { id: "dictionary", label: "그림 사전", icon: `${basePath}/icons/icon-dictionary.svg` },
    { id: "library", label: "자료실", icon: `${basePath}/icons/icon-library.svg` },
    { id: "tool", label: "수업 도우미", icon: `${basePath}/icons/icon-tool.svg` },
    { id: "schedule", label: "진도 관리", icon: `${basePath}/icons/icon-schedule.svg` },
    { id: "help", label: "도움말", icon: `${basePath}/icons/icon-help.svg` },
  ];

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, itemId: string) => {
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      
      const item = dragItems.find((i) => i.id === itemId);
      if (item) {
        setDragging(itemId);
        setDragOffset({ x: clientX - item.x, y: clientY - item.y });
      }
    },
    [dragItems]
  );

  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setDragItems((prev) =>
        prev.map((item) =>
          item.id === dragging
            ? { ...item, x: clientX - dragOffset.x, y: clientY - dragOffset.y }
            : item
        )
      );
    },
    [dragging, dragOffset]
  );

  const handleDragEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(null);
  }, [dragging]);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl shadow-xl select-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#d5cddc",
      }}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${basePath}/images/warming-up-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Top Navbar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4"
        style={{
          height: `${32 * scale}px`,
          backgroundColor: "#b777e9",
        }}
      >
        {/* Left side */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              backgroundColor: "#b777e9",
              padding: `${2 * scale}px ${8 * scale}px`,
            }}
          >
            <img
              src={`${basePath}/ui/lesson-header.svg`}
              alt="Lesson Data"
              style={{ height: `${24 * scale}px` }}
            />
          </div>
          
          {/* Corner Data Dropdown */}
          <div
            className="flex items-center justify-between bg-white rounded-full"
            style={{
              padding: `${4 * scale}px ${12 * scale}px`,
              minWidth: `${140 * scale}px`,
            }}
          >
            <span
              className="font-bold"
              style={{
                fontSize: `${11 * scale}px`,
                color: "#8837c6",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Corner Data
            </span>
            <img
              src={`${basePath}/ui/dropdown-arrow.svg`}
              alt=""
              style={{ width: `${10 * scale}px`, height: `${8 * scale}px` }}
            />
          </div>
        </div>

        {/* Right side nav buttons */}
        <div className="flex items-center gap-1">
          {navButtons.map((btn) => (
            <div
              key={btn.id}
              className="flex items-center gap-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: "#8837c6",
                padding: `${2 * scale}px ${8 * scale}px`,
              }}
            >
              <img
                src={btn.icon}
                alt={btn.label}
                style={{ width: `${14 * scale}px`, height: `${14 * scale}px` }}
              />
              <span
                className="text-white"
                style={{
                  fontSize: `${8 * scale}px`,
                  fontFamily: "sans-serif",
                }}
              >
                {btn.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="absolute bg-white"
        style={{
          top: `${32 * scale}px`,
          left: `${16 * scale}px`,
          right: `${16 * scale}px`,
          bottom: `${32 * scale}px`,
          borderRadius: `${8 * scale}px`,
        }}
      >
        {/* Tab Menu */}
        <div
          className="absolute flex gap-1"
          style={{ top: 0, left: `${8 * scale}px` }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="transition-all"
              style={{
                padding: `${activeTab === tab.id ? 10 : 6}px ${12 * scale}px`,
                backgroundColor:
                  activeTab === tab.id ? "#a5ffee" : "#f0e0fd",
                borderLeft: `2px solid ${activeTab === tab.id ? "#49c8b0" : "#dbbbf4"}`,
                borderRight: `2px solid ${activeTab === tab.id ? "#49c8b0" : "#dbbbf4"}`,
                borderBottom: `2px solid ${activeTab === tab.id ? "#49c8b0" : "#dbbbf4"}`,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: `${8 * scale}px`,
                borderBottomRightRadius: `${8 * scale}px`,
                fontSize: `${11 * scale}px`,
                fontWeight: "bold",
                fontFamily: "Roboto, sans-serif",
                color: activeTab === tab.id ? "#0f0f0f" : "#a94bf2",
                opacity: activeTab === tab.id ? 1 : 0.5,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="absolute"
          style={{
            top: `${50 * scale}px`,
            left: `${16 * scale}px`,
            right: `${16 * scale}px`,
            bottom: `${16 * scale}px`,
          }}
        >
          {/* Question */}
          <p
            className="font-bold text-black leading-tight"
            style={{
              fontSize: `${24 * scale}px`,
              fontFamily: "'Noto Sans KR', sans-serif",
              marginBottom: `${16 * scale}px`,
            }}
          >
            현장 체험학습에서 허락이 필요한 상황을 찾아 붙임 딱지를<br />
            붙여봅시다.
          </p>

          {/* Image and Drag Area */}
          <div
            className="flex gap-4"
            style={{ marginTop: `${16 * scale}px` }}
          >
            {/* Scene Image */}
            <div
              className="relative rounded-lg overflow-hidden flex-1"
              style={{
                height: `${280 * scale}px`,
              }}
            >
              <img
                src={`${basePath}/images/warming-up-scene.png`}
                alt="Field trip scene"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Drag Drop Area */}
            <div
              className="relative rounded-lg flex flex-col items-center justify-center gap-4"
              style={{
                width: `${140 * scale}px`,
                height: `${280 * scale}px`,
                backgroundColor: "#fff4d8",
              }}
            >
              {/* Drag items in original position */}
              {dragItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`cursor-grab active:cursor-grabbing transition-shadow ${
                    dragging === item.id ? "z-50 shadow-xl" : ""
                  }`}
                  style={{
                    position: dragging === item.id ? "fixed" : "relative",
                    left: dragging === item.id ? item.x : undefined,
                    top: dragging === item.id ? item.y : undefined,
                    width: `${60 * scale}px`,
                    height: `${60 * scale}px`,
                  }}
                  onMouseDown={(e) => handleDragStart(e, item.id)}
                  onTouchStart={(e) => handleDragStart(e, item.id)}
                >
                  <img
                    src={item.type === "o" ? `${basePath}/ui/drag-circle-o.svg` : `${basePath}/ui/drag-circle-x.svg`}
                    alt={item.type === "o" ? "O" : "X"}
                    className="w-full h-full pointer-events-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8"
        style={{
          height: `${32 * scale}px`,
          backgroundColor: "#fbf6ff",
        }}
      >
        {/* Speaker */}
        <div className="flex items-center gap-2">
          <img
            src={`${basePath}/icons/icon-speaker.svg`}
            alt="Speaker"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            style={{ width: `${20 * scale}px`, height: `${20 * scale}px` }}
          />
        </div>

        {/* Pagination */}
        <div
          className="flex items-center gap-2 bg-white rounded-full border-2"
          style={{
            borderColor: "#dfd1eb",
            padding: `${4 * scale}px ${12 * scale}px`,
          }}
        >
          <span
            style={{
              fontSize: `${10 * scale}px`,
              color: "#696969",
              fontFamily: "sans-serif",
            }}
          >
            {String(currentPage).padStart(3, "0")}쪽
          </span>
          <button
            onClick={() => handlePageChange("prev")}
            className="hover:opacity-70 transition-opacity"
            style={{ transform: "rotate(180deg)" }}
          >
            <svg
              width={12 * scale}
              height={8 * scale}
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="#696969"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            onClick={() => handlePageChange("next")}
            className="hover:opacity-70 transition-opacity"
          >
            <svg
              width={12 * scale}
              height={8 * scale}
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="#696969"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
