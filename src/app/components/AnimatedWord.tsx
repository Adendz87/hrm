"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const words = ["automate", "create", "scale", "transform"];

const WORD_DURATION = 2600;

const ENTER_STAGGER = 26;
const EXIT_STAGGER = 18;
const ENTER_DURATION = 520;
const EXIT_DURATION = 420;
const OVERLAP_DELAY = 90;
const WIDTH_DURATION = 460;

// chừa descender cho g / y / p / q
const DESCENDER_PAD = "0.12em";
// thêm chút breathing room bên phải để blur không bị cắt
const RIGHT_PAD_PX = 6;

export default function AnimatedWord() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [phaseKey, setPhaseKey] = useState(0);
  const [wordWidth, setWordWidth] = useState<number>();

  const rulerRef = useRef<HTMLSpanElement>(null);
  const cleanupTimerRef = useRef<number | null>(null);

  const currentWord = words[currentIdx];
  const prevWord = prevIdx !== null ? words[prevIdx] : null;

  const currentChars = useMemo(() => currentWord.split(""), [currentWord]);
  const prevChars = useMemo(
    () => (prevWord ? prevWord.split("") : []),
    [prevWord]
  );

  useLayoutEffect(() => {
    if (rulerRef.current) {
      setWordWidth(rulerRef.current.offsetWidth + RIGHT_PAD_PX);
    }
  }, [currentWord]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentIdx((prev) => {
        setPrevIdx(prev);
        return (prev + 1) % words.length;
      });
      setPhaseKey((k) => k + 1);
    }, WORD_DURATION);

    return () => window.clearInterval(id);
  }, []);

  const exitTotal = prevChars.length * EXIT_STAGGER + EXIT_DURATION;
  const enterTotal =
    OVERLAP_DELAY + currentChars.length * ENTER_STAGGER + ENTER_DURATION;
  const cleanupAfter = Math.max(exitTotal, enterTotal) + 120;

  useEffect(() => {
    if (prevIdx === null) return;

    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current);
    }

    cleanupTimerRef.current = window.setTimeout(() => {
      setPrevIdx(null);
    }, cleanupAfter);

    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, [prevIdx, cleanupAfter]);

  return (
    <>
      <style>{`
      @keyframes xCharIn {
        0% {
          opacity: 0;
          transform: translate3d(0, 115%, 0) scale(0.985);
          filter: blur(10px);
        }
        55% {
          opacity: 1;
          filter: blur(2px);
        }
        100% {
          opacity: 1;
          transform: translate3d(0, 0%, 0) scale(1);
          filter: blur(0px);
        }
      }

      @keyframes xCharOut {
        0% {
          opacity: 1;
          transform: translate3d(0, 0%, 0) scale(1);
          filter: blur(0px);
        }
        100% {
          opacity: 0;
          transform: translate3d(0, -85%, 0) scale(0.985);
          filter: blur(8px);
        }
      }

      @keyframes rgbFlow {
        0%   { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
      }
    `}</style>

      {/* ruler đo width chữ thật */}
      <span
        ref={rulerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          visibility: "hidden",
          whiteSpace: "nowrap",
          font: "inherit",
          letterSpacing: "inherit",
          lineHeight: "inherit",
        }}
      >
        {currentWord}
      </span>

      {/* dùng cùng hệ box với TextReveal */}
      <span className="inline-flex items-center">
        <span
          className="relative inline-flex items-center"
          style={{
            width: wordWidth ? `${wordWidth}px` : "auto",
            height: "1.08em",
            transition: `width ${WIDTH_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          <span
            className="relative inline-flex h-full items-center overflow-hidden"
            style={{
              paddingRight: `${RIGHT_PAD_PX}px`,
            }}
          >
            {/* anchor giữ width + height */}
            <span className="invisible inline-block whitespace-nowrap">
              {currentWord}
            </span>

            {/* old word */}
            {prevWord && (
              <span
                key={`out-wrap-${phaseKey}-${prevWord}`}
                className="absolute inset-0 flex items-center whitespace-nowrap"
              >
                {prevChars.map((char, i) => (
                  <span
                    key={`out-${phaseKey}-${prevWord}-${i}`}
                    style={{
                      display: "inline-block",
                      willChange: "transform, opacity, filter",
                      animationName: "xCharOut",
                      animationDuration: `${EXIT_DURATION}ms`,
                      animationTimingFunction: "cubic-bezier(0.55, 0, 0.2, 1)",
                      animationFillMode: "forwards",
                      animationDelay: `${i * EXIT_STAGGER}ms`,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            )}

            {/* new word */}
            <span
              key={`in-wrap-${phaseKey}-${currentWord}`}
              className="absolute inset-0 flex items-center whitespace-nowrap"
            >
              {currentChars.map((char, i) => (
                <span
                  key={`in-${phaseKey}-${currentWord}-${i}`}
                  style={{
                    display: "inline-block",
                    opacity: 0,
                    transform: "translate3d(0,115%,0)",
                    willChange: "transform, opacity, filter",
                    animationName: "xCharIn",
                    animationDuration: `${ENTER_DURATION}ms`,
                    animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    animationFillMode: "forwards",
                    animationDelay: `${OVERLAP_DELAY + i * ENTER_STAGGER}ms`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>

            {/* underline */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0"
              style={{
                bottom: "0.08em",
                height: 3,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #312e81, #4f46e5, #7c3aed, #db2777, #ea580c, #ca8a04, #4f46e5, #312e81)",
                backgroundSize: "200% 100%",
                animation: "rgbFlow 2.8s linear infinite",
              }}
            />
          </span>
        </span>
      </span>
    </>
  );
}