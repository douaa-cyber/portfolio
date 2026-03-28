"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GLYPHS = [
  { sym: "✦", side: "left" as const, topPct: 8, size: 1.1 },
  { sym: "⊕", side: "left" as const, topPct: 22, size: 0.95 },
  { sym: "◇", side: "left" as const, topPct: 38, size: 1 },
  { sym: "✕", side: "left" as const, topPct: 55, size: 0.85 },
  { sym: "◈", side: "left" as const, topPct: 72, size: 1.05 },
  { sym: "✦", side: "right" as const, topPct: 12, size: 0.9 },
  { sym: "△", side: "right" as const, topPct: 28, size: 1 },
  { sym: "⊡", side: "right" as const, topPct: 44, size: 0.88 },
  { sym: "✳", side: "right" as const, topPct: 60, size: 1.12 },
  { sym: "◎", side: "right" as const, topPct: 78, size: 0.92 },
  { sym: "</>", side: "mid" as const, topPct: 18, size: 0.65 },
  { sym: "{ }", side: "mid" as const, topPct: 66, size: 0.6 },
];

export default function ScrollCompanion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main || !rootRef.current) return;

    const mq = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mq.add("(prefers-reduced-motion: no-preference)", () => {
        parallaxRefs.current.forEach((el, i) => {
          if (!el) return;
          const depth = 0.85 + (i % 5) * 0.06;
          const drift = (i % 3) - 1;
          gsap.fromTo(
            el,
            {
              y: -32 - (i % 4) * 14,
              x: drift * 8,
              rotation: -10 + (i % 7) * 2.5,
              opacity: 0.4,
            },
            {
              y: 120 + i * 16,
              x: -drift * 14,
              rotation: 14 - (i % 5) * 2.5,
              opacity: 0.62,
              ease: "none",
              scrollTrigger: {
                trigger: main,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.1 * depth,
              },
            },
          );
        });
      });

      mq.add("(prefers-reduced-motion: reduce)", () => {
        parallaxRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 0.18 });
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      mq.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="scroll-companion" aria-hidden>
      {GLYPHS.map((g, i) => (
        <div
          key={`${g.sym}-${i}`}
          className={`scroll-companion-anchor scroll-companion-anchor--${g.side}`}
          style={{ top: `${g.topPct}%` }}
        >
          <div
            ref={(node) => {
              parallaxRefs.current[i] = node;
            }}
            className="scroll-companion-parallax"
          >
            <span
              className="scroll-companion-icon"
              style={{
                fontSize: `clamp(${0.75 * g.size}rem, ${1.1 * g.size}vw, ${1.35 * g.size}rem)`,
                animationDelay: `${i * 0.22}s`,
              }}
            >
              {g.sym}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
