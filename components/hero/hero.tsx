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
  const highlightRef = useRef<HTMLDivElement>(null);
  // NEW: scroll fill bar ref
  const scrollFillRef = useRef<HTMLDivElement>(null);

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
            gsap.to(l, { color: "#041830", duration: 0.35 });
            if (num)
              gsap.to(num, { color: "#0066ff", opacity: 1, duration: 0.3 });
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

      // No link is active while on the hero — deactivate all on load
      const deactivateAll = () => {
        navLinks.forEach((l) => {
          const num = l.querySelector<HTMLElement>(".bn-num");
          gsap.to(l, { color: "rgba(255,255,255,0.45)", duration: 0.35 });
          if (num)
            gsap.to(num, {
              color: "rgba(255,255,255,0.28)",
              opacity: 0.7,
              duration: 0.3,
            });
        });
        // Shrink highlight pill to nothing
        if (highlightRef.current)
          gsap.to(highlightRef.current, { width: 0, duration: 0.3 });
      };

      setTimeout(() => deactivateAll(), 100);

      // Hero zone — no active link
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "32% top",
        onEnter: () => deactivateAll(),
        onEnterBack: () => deactivateAll(),
      });
      // About (01) activates at ~32% scroll
      ScrollTrigger.create({
        trigger: "body",
        start: "32% top",
        end: "65% top",
        onEnter: () => activateLink(0),
        onEnterBack: () => activateLink(0),
      });
      // Stats (02)
      ScrollTrigger.create({
        trigger: "body",
        start: "65% top",
        end: "82% top",
        onEnter: () => activateLink(1),
        onEnterBack: () => activateLink(1),
      });
      // Work (03)
      ScrollTrigger.create({
        trigger: "body",
        start: "82% top",
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

      /* ── 8. SCROLL FILL NAV BAR ── */
      const fill = scrollFillRef.current;
      if (fill) {
        let scrollTimer: ReturnType<typeof setTimeout> | null = null;
        let lastScrollY = window.scrollY;
        let animFrame: number;

        const updateFill = () => {
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress =
            maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
          // Width fills the entire nav
          if (bottomNavRef.current) {
            const navWidth = bottomNavRef.current.offsetWidth;
            gsap.to(fill, {
              width: navWidth * progress,
              duration: 0.25,
              ease: "power1.out",
            });
          }
        };

        const onScroll = () => {
          lastScrollY = window.scrollY;
          updateFill();

          // Clear freeze timeout while scrolling
          if (scrollTimer) clearTimeout(scrollTimer);

          // When scroll stops, freeze fill where it is (do nothing — it's already frozen by GSAP)
          scrollTimer = setTimeout(() => {
            // intentionally empty — fill stays at current position
          }, 150);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        // Initial paint
        updateFill();
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

      <section ref={sectionRef} className="hero">
        <div className="grid-bg" />
        <div className="scanlines" />
        <div ref={glow1Ref} className="glow-1" />
        <div ref={glow2Ref} className="glow-2" />

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

        {/* BOTTOM FLOATING NAVBAR */}
        <nav ref={bottomNavRef} className="bottom-nav">
          {/* Scroll progress fill — sits BEHIND everything */}
          <div ref={scrollFillRef} className="bn-scroll-fill" />

          {/* Active section pill highlight */}
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
