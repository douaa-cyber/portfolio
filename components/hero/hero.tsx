"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const disciplinesRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // New ref for the sliding white highlight pill
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── 1. ENTRANCE TIMELINE ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        navRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 },
      );
      tl.fromTo(
        line1Ref.current,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.0 },
        "-=0.35",
      );
      tl.fromTo(
        line2Ref.current,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.0 },
        "-=0.72",
      );
      tl.fromTo(
        [taglineRef.current, disciplinesRef.current, scrollHintRef.current],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.14 },
        "-=0.55",
      );
      tl.fromTo(
        rightRef.current,
        { x: 100, opacity: 0, scale: 0.85 },
        { x: 0, opacity: 1, scale: 1, duration: 1.15, ease: "power2.out" },
        "-=1.0",
      );
      tl.fromTo(
        bottomNavRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "power2.out" },
        "-=0.55",
      );

      /* ── SCROLL-ACTIVE NAV LINKS ── */
      const navLinks = Array.from(
        document.querySelectorAll<HTMLElement>(".bn-link"),
      );

      const activateLink = (index: number) => {
        navLinks.forEach((l, i) => {
          const num = l.querySelector<HTMLElement>(".bn-num");
          if (i === index) {
            // Text turns dark so it's readable on the white background fill
            gsap.to(l, { color: "#041830", duration: 0.35 });
            if (num)
              gsap.to(num, { color: "#0066ff", opacity: 1, duration: 0.3 });

            // Slide the white highlight behind the active link
            if (highlightRef.current && bottomNavRef.current) {
              const navRect = bottomNavRef.current.getBoundingClientRect();
              const linkRect = l.getBoundingClientRect();

              gsap.to(highlightRef.current, {
                x: linkRect.left - navRect.left,
                width: linkRect.width,
                duration: 0.4,
                ease: "power3.out",
              });
            }
          } else {
            // Inactive text remains white/transparent
            gsap.to(l, { color: "rgba(255,255,255,0.45)", duration: 0.35 });
            if (num)
              gsap.to(num, {
                color: "rgba(255,255,255,0.28)",
                opacity: 0.7,
                duration: 0.3,
              });
          }
        });
      };

      // Slight delay on initial load to ensure layout measurements are correct
      setTimeout(() => activateLink(0), 100);

      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "32% top",
        onEnter: () => activateLink(0),
        onEnterBack: () => activateLink(0),
      });
      ScrollTrigger.create({
        trigger: "body",
        start: "32% top",
        end: "65% top",
        onEnter: () => activateLink(1),
        onEnterBack: () => activateLink(1),
      });
      ScrollTrigger.create({
        trigger: "body",
        start: "65% top",
        end: "100% bottom",
        onEnter: () => activateLink(2),
        onEnterBack: () => activateLink(2),
      });

      /* ── 2. GLOWS BREATHE ── */
      gsap.to(glow1Ref.current, {
        scale: 1.2,
        opacity: 0.75,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(glow2Ref.current, {
        scale: 1.25,
        opacity: 0.55,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });

      /* ── 3. CROSS SUBTLE ROCK ── */
      gsap.to(crossRef.current, {
        rotation: 8,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center",
      });

      /* ── 4. SCROLL PARALLAX ── */
      gsap.to([line1Ref.current, line2Ref.current], {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to(rightRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
      // (Removed the opacity fade to 0.2 that was causing the name to disappear)

      /* ── 5. MOUSE PARALLAX + 3D TILT ── */
      const onMouseMove = (e: MouseEvent) => {
        const rx = (e.clientY / window.innerHeight - 0.5) * -14;
        const ry = (e.clientX / window.innerWidth - 0.5) * 14;
        gsap.to(rightRef.current, {
          rotateX: rx,
          rotateY: ry,
          transformPerspective: 900,
          duration: 0.55,
          ease: "power2.out",
        });
        gsap.to(glow1Ref.current, {
          x: (e.clientX / window.innerWidth - 0.5) * 48,
          y: (e.clientY / window.innerHeight - 0.5) * 35,
          duration: 1.3,
          ease: "power1.out",
        });
        gsap.to(glow2Ref.current, {
          x: (e.clientX / window.innerWidth - 0.5) * -32,
          y: (e.clientY / window.innerHeight - 0.5) * -22,
          duration: 1.6,
          ease: "power1.out",
        });
      };
      window.addEventListener("mousemove", onMouseMove);

      /* ── 6. MAGNETIC CTA ── */
      const btn = ctaRef.current;
      if (btn) {
        const onBtnMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.38,
            y: (e.clientY - (r.top + r.height / 2)) * 0.38,
            duration: 0.3,
            ease: "power2.out",
          });
        };
        const onBtnLeave = () =>
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.55,
            ease: "elastic.out(1,0.4)",
          });

        btn.addEventListener("mousemove", onBtnMove);
        btn.addEventListener("mouseleave", onBtnLeave);
      }

      /* ── 7. CUSTOM CURSOR ── */
      const ring = cursorRef.current;
      const dot = cursorDotRef.current;
      if (ring && dot) {
        gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

        window.addEventListener("mousemove", (e) => {
          gsap.to(ring, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power2.out",
          });
          gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08 });
        });

        document
          .querySelectorAll("button, .bn-link, .c-icon, a")
          .forEach((el) => {
            el.addEventListener("mouseenter", () =>
              gsap.to(ring, {
                scale: 2.6,
                borderColor: "var(--teal)",
                duration: 0.3,
              }),
            );
            el.addEventListener("mouseleave", () =>
              gsap.to(ring, {
                scale: 1,
                borderColor: "rgba(255,255,255,0.42)",
                duration: 0.3,
              }),
            );
          });
      }

      return () => window.removeEventListener("mousemove", onMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Space+Mono:wght@400;700&family=Oxanium:wght@700;800&display=swap');

        /* ── TOKENS ── */
        :root {
          --bg:    #041830;
          --teal:  #00e5c8;
          --blue:  #0066ff;
          --cyan:  #00cfff;
          --white: #f0f4ff;
          --grid:  rgba(0,200,255,0.1);
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { cursor: none; }
        body { background: var(--bg); overflow-x: hidden; }

        /* ── CUSTOM CURSOR ── */
        .cursor-ring {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 34px; height: 34px;
          border: 1.5px solid rgba(255,255,255,0.42);
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
        }
        .cursor-dot {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 5px; height: 5px;
          background: var(--teal);
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100svh;
          width: 100%;
          overflow: hidden;
          background:
            radial-gradient(ellipse 90% 70% at 20% 60%, rgba(0,80,200,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 70% 30%, rgba(0,160,140,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 80%, rgba(0,40,120,0.4) 0%, transparent 60%),
            linear-gradient(160deg, #041830 0%, #062a3a 40%, #041e30 70%, #030e1a 100%);
          font-family: 'Space Mono', monospace;
          color: var(--white);
        }

        /* ── GRID ── */
        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 82% 82% at 50% 50%, black 38%, transparent 100%);
        }

        /* ── SCANLINES ── */
        .scanlines {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.022) 2px, rgba(0,0,0,0.022) 4px
          );
        }

        /* ── DECO SQUARES ── */
        .deco-squares { position: absolute; inset: 0; pointer-events: none; }
        .deco-sq {
          position: absolute;
          border: 1px solid rgba(0,200,255,0.14);
          border-radius: 16px;
        }

        /* ── GLOWS ── */
        .glow-1 {
          position: absolute;
          width: 800px; height: 800px;
          left: -120px; top: 50%;
          transform: translateY(-58%);
          background: radial-gradient(circle, rgba(0,120,255,0.6) 0%, rgba(0,60,160,0.3) 40%, transparent 65%);
          filter: blur(50px);
          pointer-events: none;
          will-change: transform;
        }
        .glow-2 {
          position: absolute;
          width: 600px; height: 600px;
          right: 10%; top: 5%;
          background: radial-gradient(circle, rgba(0,230,210,0.45) 0%, rgba(0,160,180,0.2) 40%, transparent 65%);
          filter: blur(55px);
          pointer-events: none;
          will-change: transform;
        }

        /* ── NAVBAR ── */
        .navbar {
          position: absolute; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 40px;
          opacity: 0;
        }
        .nav-logo {
          font-family: 'Oxanium', sans-serif;
          font-weight: 800; font-size: 1.4rem;
          letter-spacing: 0px; text-transform: uppercase;
          color: var(--white);
        }
        .nav-logo span { color: var(--teal); }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-sound {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.5);
          width: 38px; height: 38px;
          border-radius: 50%;
          font-size: 0.85rem;
          cursor: none;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, color 0.2s;
        }
        .nav-sound:hover { border-color: var(--teal); color: var(--teal); }
        .nav-cta {
          background: var(--white); color: var(--bg);
          border: none; padding: 11px 30px;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          cursor: none; border-radius: 5px;
          transition: background 0.25s;
          will-change: transform;
        }
        .nav-cta:hover { background: var(--teal); }

        /* ── SIDE LABELS ── */
        .side-label {
          position: absolute; writing-mode: vertical-rl;
          font-size: 0.62rem; letter-spacing: 5px; text-transform: uppercase;
          color: rgba(255,255,255,0.42);
          top: 50%; transform: translateY(-50%);
          z-index: 20; cursor: default;
          transition: color 0.3s ease, letter-spacing 0.3s ease;
        }
        .side-label:hover { color: var(--teal); letter-spacing: 8px; }
        .side-label-left  { left: 14px; }
        .side-label-right { right: 14px; transform: translateY(-50%) rotate(180deg); }

        /* ── CONTENT LAYOUT ── */
        .content {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          min-height: 100svh;
          padding: 0 48px;
          gap: 20px;
        }

        /* ── LEFT ── */
        .left { flex: 1; max-width: 700px; padding-top: 56px; }

        .headline-clip { overflow: hidden; line-height: 0.93; }

        .headline {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: clamp(4.5rem, 11vw, 10.5rem);
          line-height: 0.93; letter-spacing: -3px;
          color: var(--white); text-transform: uppercase;
          display: block; will-change: transform;
        }
        .headline-outline {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: clamp(4.5rem, 11vw, 10.5rem);
          line-height: 0.93; letter-spacing: -3px;
          color: transparent;
          -webkit-text-stroke: 2px var(--teal);
          text-transform: uppercase;
          display: block; will-change: transform;
        }
        .word-w {
          display: inline-block;
          font-size: 0.42em; letter-spacing: 0;
          color: var(--white); -webkit-text-stroke: 0;
          opacity: 0.65; vertical-align: middle; margin-right: 10px;
        }

        .tagline {
          margin-top: 24px;
          display: flex; align-items: center; gap: 16px;
          opacity: 0;
        }
        .tagline-badge {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.05rem; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--white);
        }
        .tagline-year {
          font-size: 0.68rem; letter-spacing: 4px;
          color: rgba(255,255,255,0.5);
          border-left: 1px solid rgba(255,255,255,0.2);
          padding-left: 16px;
        }

        .disciplines {
          margin-top: 28px;
          display: flex; align-items: center; gap: 18px;
          font-size: 0.82rem; letter-spacing: 5px; text-transform: uppercase;
          font-weight: 700; color: rgba(255,255,255,0.95);
          opacity: 0;
        }
        .disc-sep { color: var(--teal); font-size: 1.1rem; }

        .scroll-hint {
          margin-top: 52px;
          font-size: 0.7rem; letter-spacing: 6px; text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          display: flex; align-items: center; gap: 14px;
          opacity: 0;
          font-weight: 700;
        }
        .scroll-hint::before {
          content: '';
          display: block; width: 44px; height: 1px;
          background: rgba(255,255,255,0.5);
        }

        /* ── RIGHT — 3D OBJECT ── */
        .right {
          flex-shrink: 0;
          width: clamp(280px, 38vw, 540px);
          aspect-ratio: 1;
          position: relative;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; will-change: transform;
        }

        .orb-ring, .orb-ring-2 {
          position: absolute; border-radius: 50%;
        }
        .orb-ring   { inset: -5%; border: 1px solid rgba(0,230,200,0.09); }
        .orb-ring-2 { inset: 8%;  border: 1px solid rgba(0,100,255,0.07); }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-22px); }
        }
        .orb-wrap {
          width: 100%; height: 100%;
          position: relative;
          animation: float 5.5s ease-in-out infinite;
          will-change: transform;
        }

        .chrome-cross {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .cross-h, .cross-v {
          position: absolute; border-radius: 28px;
          background: linear-gradient(135deg, #00e5c8 0%, #0055ff 40%, #9b59b6 70%, #00cfff 100%);
        }
        .cross-h {
          width: 76%; height: 28%;
          box-shadow:
            0 0 80px rgba(0,200,200,0.45),
            0 0 28px rgba(0,100,255,0.4),
            inset 0 6px 30px rgba(255,255,255,0.12);
        }
        .cross-v {
          width: 28%; height: 76%;
          box-shadow:
            0 0 80px rgba(0,180,255,0.45),
            0 0 28px rgba(0,100,255,0.4),
            inset 6px 0 30px rgba(255,255,255,0.12);
        }
        .cross-center {
          position: absolute; width: 30%; height: 30%;
          border-radius: 18px;
          background: linear-gradient(135deg, #00e5c8, #0066ff);
          box-shadow:
            0 0 100px rgba(0,160,255,0.9),
            0 0 40px  rgba(0,230,200,0.6);
        }
        .cross-h::after, .cross-v::after {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.18) 0%,
            transparent 55%,
            rgba(0,0,0,0.15) 100%
          );
        }

        @keyframes neonFlicker {
          0%, 93%, 100% { opacity: 1; }
          94% { opacity: 0.5; }
          96% { opacity: 0.3; }
          98% { opacity: 1;   }
        }
        .chrome-cross { animation: neonFlicker 9s ease-in-out infinite; }

        /* ── BOTTOM NAV ── */
        .bottom-nav {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 0;
          width: clamp(500px, 62vw, 800px);
          padding: 6px 6px 6px 0;
          background: #080f1c;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 60px;
          white-space: nowrap;
          opacity: 0;
          box-shadow: 0 8px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        /* Essential for stacking contexts so text stays above highlight */
        .bn-logo-box, .bn-links { position: relative; z-index: 10; }

        /* Left logo circle */
        .bn-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
        
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          margin-right: 10px;
          margin-left: 6px;
        }
        .bn-logo-box span {
          font-family: 'Oxanium', sans-serif;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0px;
          color: var(--white);
          line-height: 1;
        }

        /* Center links */
        .bn-links {
          display: flex; align-items: center; flex: 1;
          justify-content: center; gap: 2;
        }

        .bn-sep {
          color: rgba(255,255,255,0.35);
          font-size: 1.6rem;
          margin: 0 25px;
          flex-shrink: 0;
          line-height: 1;
          display: flex;
          align-items: center;
        }

        .bn-link {
          font-family: 'Space Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          cursor: none;
          display: flex; align-items: center; gap: 8px;
          position: relative;
          padding: 10px 24px; /* Added padding to make the white pill thicker behind it */
          border-radius: 30px;
          white-space: nowrap;
        }

        .bn-num {
          font-family: 'Space Mono', monospace;
          color: rgba(255,255,255,0.35);
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0; 
          margin-right: 2px;
        }
        .bn-link:hover .bn-num { color: var(--teal); }
        .bn-link.active .bn-num { color: var(--teal); }

        /* The white sliding fill pill */
        .bn-highlight {
          position: absolute;
          top: 6px; /* Matches bottom-nav padding to keep it centered vertically */
          height: calc(100% - 12px);
          background: #ffffff;
          border-radius: 40px;
          pointer-events: none;
          z-index: 0; /* Placed behind the text */
          left: 0;
        }

        /* ── CORNER ICONS ── */
        .corner-icons {
          position: absolute; right: 20px; top: 50%;
          transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 18px;
          z-index: 20;
        }
        .c-icon {
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.15); font-size: 0.9rem; cursor: none;
          transition: color 0.2s, transform 0.2s;
        }
        .c-icon:hover { color: var(--teal); transform: scale(1.2); }

        /* ── TICKER ── */
        .ticker-wrap {
          position: absolute; bottom: 92px; left: 0;
          z-index: 20; overflow: hidden; padding: 0 44px;
        }
        .ticker-inner {
          font-size: 0.5rem; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,255,255,0.12);
          display: inline-block;
          animation: tickerScroll 10s linear infinite;
          white-space: nowrap;
        }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── CUSTOM CURSOR ── */}
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={cursorDotRef} className="cursor-dot" />

      <section ref={sectionRef} className="hero">
        {/* BG layers */}
        <div className="grid-bg" />
        <div className="scanlines" />
        <div ref={glow1Ref} className="glow-1" />
        <div ref={glow2Ref} className="glow-2" />

        {/* Deco rounded squares */}
        <div className="deco-squares">
          {[
            { w: 180, h: 140, top: "8%", right: "42%" },
            { w: 140, h: 110, top: "15%", right: "28%" },
            { w: 200, h: 160, top: "5%", right: "20%" },
            { w: 240, h: 200, top: "20%", right: "10%" },
            { w: 160, h: 130, bottom: "20%", right: "35%" },
            { w: 190, h: 150, bottom: "8%", right: "22%" },
            { w: 150, h: 120, bottom: "15%", right: "8%" },
          ].map((s, i) => (
            <div
              key={i}
              className="deco-sq"
              style={{
                width: s.w,
                height: s.h,
                top: s.top,
                bottom: s.bottom,
                right: s.right,
              }}
            />
          ))}
        </div>

        {/* Vertical side labels */}
        <div className="side-label side-label-left">
          Portfolio — Full Stack Dev
        </div>
        <div className="side-label side-label-right">
          Design × Development × Branding
        </div>

        {/* TOP NAVBAR */}
        <nav ref={navRef} className="navbar">
          <div className="nav-logo">
            D<span>.</span>A
          </div>
          <div className="nav-right">
            <button className="nav-sound" aria-label="Toggle sound">
              ♪
            </button>
            <button ref={ctaRef} className="nav-cta">
              Say Hello
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="content">
          {/* LEFT — headline + meta */}
          <div className="left">
            <h1>
              <div className="headline-clip">
                <div ref={line1Ref} className="headline">
                  Douaa
                </div>
              </div>
              <div className="headline-clip">
                <div ref={line2Ref} className="headline-outline">
                  Agraine
                </div>
              </div>
            </h1>

            <div ref={taglineRef} className="tagline">
              <span className="tagline-badge">Portfolio ©2026</span>
              <span className="tagline-year">Algiers, DZ</span>
            </div>

            <div ref={disciplinesRef} className="disciplines">
              <span>Design</span>
              <span className="disc-sep">✦</span>
              <span>Development</span>
              <span className="disc-sep">✦</span>
              <span>Branding</span>
            </div>

            <div ref={scrollHintRef} className="scroll-hint">
              Scroll to explore
            </div>
          </div>

          {/* RIGHT — Chrome cross 3D object */}
          <div ref={rightRef} className="right">
            <div className="orb-ring" />
            <div className="orb-ring-2" />
            <div className="orb-wrap">
              <div ref={crossRef} className="chrome-cross">
                <div className="cross-h" />
                <div className="cross-v" />
                <div className="cross-center" />
              </div>
            </div>
          </div>
        </div>
        {/* end .content */}

        {/* CORNER ICONS */}
        <div className="corner-icons">
          {["✦", "✕", "⊕", "⊡"].map((ic, i) => (
            <div key={i} className="c-icon">
              {ic}
            </div>
          ))}
        </div>

        {/* BOTTOM FLOATING NAVBAR */}
        <nav ref={bottomNavRef} className="bottom-nav">
          <div ref={highlightRef} className="bn-highlight" />
          <div className="bn-logo-box">
            <span>D.A</span>
          </div>
          <div className="bn-links">
            <span className="bn-link" data-section="about">
              <span className="bn-num">01.</span> About
            </span>
            <span className="bn-sep">✳︎</span>
            <span className="bn-link" data-section="stats">
              <span className="bn-num">02.</span> Stats
            </span>
            <span className="bn-sep">✳︎</span>
            <span className="bn-link" data-section="work">
              <span className="bn-num">03.</span> Work
            </span>
          </div>
        </nav>

        {/* TICKER — duplicated for seamless loop */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            ✦✦✦✦ × ⊕ &gt;&gt;&gt;&gt;&gt;&nbsp;&nbsp;&nbsp; ✦✦✦✦ × ⊕
            &gt;&gt;&gt;&gt;&gt;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </section>
    </>
  );
}
