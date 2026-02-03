"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface Email {
  id: string;
  sender: string;
  senderInitial: string;
  avatarColor: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  hasAttachment?: boolean;
  attachmentName?: string;
}

interface EmailListScreenProps {
  width?: number;
  height?: number;
  onBack?: () => void;
}

const initialEmails: Email[] = [
  {
    id: "1",
    sender: "Figma",
    senderInitial: "F",
    avatarColor: "#5B69E9",
    subject: 'Toni has invited you to view the file "Toni\'s Hot Takes"',
    preview:
      'Toni has invited you to view the file "Toni\'s Hot Takes". Figma is the first design tool with real-time collabora...',
    date: "10:45 AM",
    isRead: false,
  },
  {
    id: "2",
    sender: "Travel Alerts",
    senderInitial: "T",
    avatarColor: "#FF5722",
    subject: "Direct flights to Shanghai, China starting at $480...",
    preview:
      "Book now to experience thousands of years of history in the international city of Shanghai. We've found dea...",
    date: "Yesterday",
    isRead: false,
  },
  {
    id: "3",
    sender: "Yuna, Iko, Pepper, Thea, Zen",
    senderInitial: "",
    avatarColor: "",
    subject: "Visit us at figma.com/dogs-of-figma",
    preview:
      "Named one of the most dog friendly companies of 2019 by Rover.com, Figma's dog friendly office enviro...",
    date: "Sep 10",
    isRead: true,
    hasAttachment: false,
  },
  {
    id: "4",
    sender: "Dylan Evans",
    senderInitial: "D",
    avatarColor: "#4CAF50",
    subject: "I'd love to work at Figma. Hire me!",
    preview:
      "Hello, I'm very interested to help build the world's first collaborative, web-based interface design tool. I have...",
    date: "Sep 2",
    isRead: true,
    hasAttachment: true,
    attachmentName: "Resume.pdf",
  },
  {
    id: "5",
    sender: "Sahara.com",
    senderInitial: "S",
    avatarColor: "#9C27B0",
    subject: "Your order is on the way! #82913864",
    preview:
      "Thank you for your purchase! You package is being packed and will be on its way to its final destination...",
    date: "Aug 30",
    isRead: true,
  },
  {
    id: "6",
    sender: "GitHub",
    senderInitial: "G",
    avatarColor: "#333333",
    subject: "Your pull request was merged",
    preview:
      "Congratulations! Your pull request #142 has been merged into the main branch. Thank you for your contribution...",
    date: "Aug 28",
    isRead: true,
  },
  {
    id: "7",
    sender: "Netflix",
    senderInitial: "N",
    avatarColor: "#E50914",
    subject: "New shows added just for you",
    preview:
      "Based on your watching history, we've added new recommendations to your list. Check out what's new this week...",
    date: "Aug 25",
    isRead: true,
  },
  {
    id: "8",
    sender: "Spotify",
    senderInitial: "S",
    avatarColor: "#1DB954",
    subject: "Your weekly playlist is ready",
    preview:
      "Discover Weekly is here! We've curated 30 songs just for you based on your listening habits. Start listening now...",
    date: "Aug 22",
    isRead: true,
  },
  {
    id: "9",
    sender: "Amazon",
    senderInitial: "A",
    avatarColor: "#FF9900",
    subject: "Deal of the day: 50% off electronics",
    preview:
      "Don't miss out on today's lightning deals! Get up to 50% off on electronics, home appliances, and more...",
    date: "Aug 20",
    isRead: true,
  },
  {
    id: "10",
    sender: "LinkedIn",
    senderInitial: "L",
    avatarColor: "#0A66C2",
    subject: "5 people viewed your profile this week",
    preview:
      "Your profile is getting attention! See who's been looking at your profile and connect with new professionals...",
    date: "Aug 18",
    isRead: true,
  },
];

const newEmail: Email = {
  id: "0",
  sender: "New Message",
  senderInitial: "N",
  avatarColor: "#FF005C",
  subject: "You have a new notification!",
  preview:
    "This is a new email that appeared after pull to refresh. Check out the latest updates from your inbox...",
  date: "Just now",
  isRead: false,
};

export default function EmailListScreen({
  width = 360,
  height = 640,
  onBack,
}: EmailListScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const refreshIndicatorRef = useRef<HTMLDivElement>(null);
  const refreshIconRef = useRef<HTMLDivElement>(null);
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startYRef = useRef(0);
  const scrollTopRef = useRef(0);

  const scale = width / 360;
  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  // Touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isRefreshing) return;
      const clientY = e.touches[0].clientY;
      startYRef.current = clientY;
      scrollTopRef.current = listRef.current?.scrollTop || 0;
    },
    [isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isRefreshing) return;

      const clientY = e.touches[0].clientY;
      const diff = clientY - startYRef.current;
      const currentScrollTop = listRef.current?.scrollTop || 0;

      // Only activate pull to refresh when at the top and pulling down
      if (diff > 10 && currentScrollTop <= 0 && scrollTopRef.current <= 0) {
        e.preventDefault();
        setIsDragging(true);
        const distance = Math.min((diff - 10) * 0.5, MAX_PULL);
        setPullDistance(distance);

        if (refreshIconRef.current) {
          const rotation = (distance / MAX_PULL) * 360;
          gsap.set(refreshIconRef.current, { rotation });
        }
      }
    },
    [isRefreshing]
  );

  // Mouse events for PC
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isRefreshing) return;
      const currentScrollTop = listRef.current?.scrollTop || 0;
      // Only track mouse for pull-to-refresh when at the top
      if (currentScrollTop <= 0) {
        setIsMouseDown(true);
        startYRef.current = e.clientY;
        scrollTopRef.current = currentScrollTop;
      }
    },
    [isRefreshing]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isMouseDown || isRefreshing) return;

      const diff = e.clientY - startYRef.current;
      const currentScrollTop = listRef.current?.scrollTop || 0;

      // Only activate pull to refresh when at the top and pulling down
      if (diff > 10 && currentScrollTop <= 0 && scrollTopRef.current <= 0) {
        setIsDragging(true);
        const distance = Math.min((diff - 10) * 0.5, MAX_PULL);
        setPullDistance(distance);

        if (refreshIconRef.current) {
          const rotation = (distance / MAX_PULL) * 360;
          gsap.set(refreshIconRef.current, { rotation });
        }
      }
    },
    [isMouseDown, isRefreshing]
  );

  const handleDragEnd = useCallback(() => {
    setIsMouseDown(false);
    if (!isDragging) return;
    setIsDragging(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      // Trigger refresh
      setIsRefreshing(true);

      // Animate to refresh position
      gsap.to(refreshIndicatorRef.current, {
        height: 104 * scale,
        duration: 0.3,
        ease: "power2.out",
      });

      // Spin the refresh icon
      gsap.to(refreshIconRef.current, {
        rotation: "+=720",
        duration: 1,
        ease: "power2.inOut",
        repeat: 1,
        onComplete: () => {
          // Add new email
          setEmails((prev) => {
            const hasNewEmail = prev.some((e) => e.id === newEmail.id);
            if (hasNewEmail) {
              return prev;
            }
            return [newEmail, ...prev];
          });

          // Hide refresh indicator
          gsap.to(refreshIndicatorRef.current, {
            height: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              setIsRefreshing(false);
              setPullDistance(0);
            },
          });
        },
      });
    } else {
      // Reset pull
      gsap.to(refreshIndicatorRef.current, {
        height: 0,
        duration: 0.2,
        ease: "power2.out",
      });
      setPullDistance(0);
    }
  }, [isDragging, pullDistance, isRefreshing, scale]);

  // Update refresh indicator height based on pull distance
  useEffect(() => {
    if (isDragging && refreshIndicatorRef.current) {
      gsap.set(refreshIndicatorRef.current, { height: pullDistance * scale });
    }
  }, [pullDistance, isDragging, scale]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[24px] shadow-xl bg-white"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Status Bar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 z-20"
        style={{
          height: `${24 * scale}px`,
          backgroundColor: "#2E2EAB",
        }}
      >
        <span
          className="text-white font-normal opacity-90"
          style={{
            fontSize: `${13 * scale}px`,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          FIGMA
        </span>
        <span
          className="text-white font-normal opacity-90"
          style={{
            fontSize: `${13 * scale}px`,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          12:30
        </span>
        <div className="flex items-center gap-1">
          <svg
            width={16 * scale}
            height={12 * scale}
            viewBox="0 0 16 12"
            fill="white"
          >
            <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" />
            <path
              d="M4.5 7C5.5 5.5 6.5 5 8 5C9.5 5 10.5 5.5 11.5 7"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M2 4C4 2 6 1 8 1C10 1 12 2 14 4"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          <svg
            width={12 * scale}
            height={12 * scale}
            viewBox="0 0 12 12"
            fill="white"
          >
            <rect x="0" y="8" width="2" height="4" rx="0.5" />
            <rect x="3" y="6" width="2" height="6" rx="0.5" />
            <rect x="6" y="4" width="2" height="8" rx="0.5" />
            <rect x="9" y="2" width="2" height="10" rx="0.5" />
          </svg>
          <svg
            width={8 * scale}
            height={13 * scale}
            viewBox="0 0 8 13"
            fill="white"
          >
            <rect x="0" y="2" width="8" height="11" rx="1" />
            <rect x="2" y="0" width="4" height="2" rx="0.5" />
          </svg>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="absolute left-0 right-0 flex z-10"
        style={{
          top: `${24 * scale}px`,
          height: `${48 * scale}px`,
          backgroundColor: "#5B69E9",
        }}
      >
        <div
          className="flex-1 flex items-center justify-center cursor-pointer relative"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: `${14 * scale}px`,
            fontWeight: 500,
            color: "white",
          }}
        >
          ALL
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${4 * scale}px`,
              backgroundColor: "#FF005C",
            }}
          />
        </div>
        <div
          className="flex-1 flex items-center justify-center cursor-pointer"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: `${14 * scale}px`,
            fontWeight: 500,
            color: "#B5C4EC",
          }}
        >
          UPDATES
        </div>
        <div
          className="flex-1 flex items-center justify-center cursor-pointer"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: `${14 * scale}px`,
            fontWeight: 500,
            color: "#B5C4EC",
          }}
        >
          PROMOTIONS
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      <div
        ref={refreshIndicatorRef}
        className="absolute left-0 right-0 flex flex-col items-center justify-center overflow-hidden z-5"
        style={{
          top: `${72 * scale}px`,
          height: 0,
          backgroundColor: "#FF005C",
        }}
      >
        <div
          ref={refreshIconRef}
          className="mb-2"
          style={{
            width: `${48 * scale}px`,
            height: `${48 * scale}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </div>
        <span
          className="text-white font-medium"
          style={{
            fontSize: `${16 * scale}px`,
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {isRefreshing ? "Refreshing..." : "Pull to Refresh"}
        </span>
      </div>

      {/* Email List */}
      <div
        ref={listRef}
        className="absolute left-0 right-0 bottom-0 overflow-y-auto overscroll-contain select-none"
        style={{
          top: `${72 * scale}px`,
          transform: `translateY(${isDragging ? pullDistance * scale : 0}px)`,
          transition: isDragging ? "none" : "transform 0.2s ease-out",
          WebkitOverflowScrolling: "touch",
          cursor: isDragging ? "grabbing" : "default",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {emails.map((email, index) => (
          <div
            key={email.id}
            className="relative cursor-pointer hover:bg-gray-50 transition-colors"
            style={{
              height: email.hasAttachment ? `${160 * scale}px` : `${104 * scale}px`,
              backgroundColor: email.isRead
                ? "rgba(161, 165, 197, 0.1)"
                : "white",
            }}
          >
            {/* Avatar */}
            {email.senderInitial ? (
              <div
                className="absolute flex items-center justify-center rounded-full text-white font-medium"
                style={{
                  width: `${24 * scale}px`,
                  height: `${24 * scale}px`,
                  left: `${8 * scale}px`,
                  top: `${10 * scale}px`,
                  backgroundColor: email.avatarColor,
                  fontSize: `${12 * scale}px`,
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                {email.senderInitial}
              </div>
            ) : (
              <div
                className="absolute rounded-full overflow-hidden"
                style={{
                  width: `${24 * scale}px`,
                  height: `${24 * scale}px`,
                  left: `${8 * scale}px`,
                  top: `${10 * scale}px`,
                }}
              >
                <img
                  src="https://placekitten.com/48/48"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Sender Name */}
            <div
              className="absolute font-medium text-black truncate"
              style={{
                left: `${40 * scale}px`,
                top: `${10 * scale}px`,
                width: `${224 * scale}px`,
                fontSize: `${16 * scale}px`,
                fontFamily: "Roboto, sans-serif",
                lineHeight: `${24 * scale}px`,
              }}
            >
              {email.sender}
            </div>

            {/* Date */}
            <div
              className="absolute text-right"
              style={{
                right: `${16 * scale}px`,
                top: `${10 * scale}px`,
                fontSize: `${12 * scale}px`,
                fontFamily: "Roboto, sans-serif",
                color: "#A1A5C5",
                lineHeight: `${24 * scale}px`,
              }}
            >
              {email.date}
            </div>

            {/* Subject */}
            <div
              className="absolute font-medium truncate"
              style={{
                left: `${40 * scale}px`,
                top: `${34 * scale}px`,
                width: `${292 * scale}px`,
                fontSize: `${12 * scale}px`,
                fontFamily: "Roboto, sans-serif",
                color: "#666666",
                lineHeight: `${24 * scale}px`,
              }}
            >
              {email.subject}
            </div>

            {/* Preview */}
            <div
              className="absolute"
              style={{
                left: `${40 * scale}px`,
                top: `${58 * scale}px`,
                right: `${28 * scale}px`,
                fontSize: `${12 * scale}px`,
                fontFamily: "Roboto, sans-serif",
                color: "#A1A5C5",
                lineHeight: `${18 * scale}px`,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {email.preview}
            </div>

            {/* Attachment */}
            {email.hasAttachment && (
              <div
                className="absolute flex items-center gap-2 rounded-lg"
                style={{
                  left: `${40 * scale}px`,
                  top: `${108 * scale}px`,
                  padding: `${8 * scale}px ${12 * scale}px`,
                  backgroundColor: "#EAEAEA",
                }}
              >
                <div
                  className="flex items-center justify-center rounded"
                  style={{
                    width: `${32 * scale}px`,
                    height: `${32 * scale}px`,
                    backgroundColor: "#FF005C",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    style={{
                      width: `${16 * scale}px`,
                      height: `${16 * scale}px`,
                    }}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div
                    className="font-medium"
                    style={{
                      fontSize: `${12 * scale}px`,
                      fontFamily: "Roboto, sans-serif",
                      color: "#333",
                    }}
                  >
                    {email.attachmentName}
                  </div>
                  <div
                    style={{
                      fontSize: `${10 * scale}px`,
                      fontFamily: "Roboto, sans-serif",
                      color: "#A1A5C5",
                    }}
                  >
                    12kb
                  </div>
                </div>
              </div>
            )}

            {/* Bottom border */}
            <div
              className="absolute left-0 right-0 bottom-0"
              style={{
                height: "1px",
                backgroundColor: "rgba(161, 165, 197, 0.2)",
              }}
            />
          </div>
        ))}
      </div>

      {/* FAB Button */}
      <div
        className="absolute cursor-pointer hover:scale-110 transition-transform z-30"
        style={{
          right: `${24 * scale}px`,
          bottom: `${24 * scale}px`,
          width: `${56 * scale}px`,
          height: `${56 * scale}px`,
        }}
        onClick={onBack}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: "#FF005C",
            boxShadow:
              "0px 0px 8px 0px rgba(0,0,0,0.12), 0px 8px 8px 0px rgba(0,0,0,0.24)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="white"
            style={{
              width: `${24 * scale}px`,
              height: `${24 * scale}px`,
            }}
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="absolute bottom-2 left-0 right-0 text-center pointer-events-none"
        style={{
          fontSize: `${10 * scale}px`,
          color: "#A1A5C5",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        아래로 드래그하여 새로고침
      </div>
    </div>
  );
}
