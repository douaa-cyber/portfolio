"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const disciplinesRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── 1. ENTRANCE TIMELINE ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

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
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
        overwrite: "auto",
        immediateRender: false,
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
        document.querySelectorAll("button, .c-icon, a").forEach((el) => {
          el.addEventListener("mouseenter", () =>
            gsap.to(ring, {
              scale: 2.6,
              borderColor: "#00e5c8",
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
      {/* ── CUSTOM CURSOR ── */}
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={cursorDotRef} className="cursor-dot" />

      <section ref={sectionRef} className="hero section">
        <div className="grid-bg" />
        <div className="scanlines" />
        <div ref={glow1Ref} className="glow-1 glow" />
        <div ref={glow2Ref} className="glow-2 glow" />

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
                bottom: (s as any).bottom,
                right: s.right,
              }}
            />
          ))}
        </div>

        <div className="side-label side-label-left">
          Portfolio — Full Stack Dev
        </div>
        <div className="side-label side-label-right">
          Design × Development × Branding
        </div>

        <div className="content">
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

        <div className="corner-icons">
          {["✦", "✕", "⊕", "⊡"].map((ic, i) => (
            <div key={i} className="c-icon">
              {ic}
            </div>
          ))}
        </div>

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
