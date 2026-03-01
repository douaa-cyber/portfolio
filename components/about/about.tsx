"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const decoDotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Photo reveal from left
      gsap.fromTo(
        photoRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // ── Title lines stagger up
      const titleLines =
        titleRef.current?.querySelectorAll(".about-title-line");
      if (titleLines) {
        gsap.fromTo(
          titleLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // ── Bio fade up
      gsap.fromTo(
        bioRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // ── Location badge
      gsap.fromTo(
        locationRef.current,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // ── Deco dots float
      gsap.to(decoDotsRef.current, {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        /* ── ABOUT SECTION ── */
        .about {
          position: relative;
          min-height: 100svh;
          width: 100%;
          overflow: hidden;
          background:
            radial-gradient(ellipse 80% 60% at 80% 40%, rgba(0,180,160,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 10% 70%, rgba(0,60,180,0.3) 0%, transparent 55%),
            linear-gradient(160deg, #041830 0%, #062a3a 50%, #041e30 100%);
          display: flex;
          align-items: center;
          padding: 120px 60px 120px 60px;
          gap: 80px;
        }

        /* ── GRID OVERLAY ── */
        .about-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,200,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.05) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 70% at 80% 50%, black 30%, transparent 100%);
        }

        /* ── DECO SQUARES (right side, same as hero) ── */
        .about-deco-squares {
          position: absolute; inset: 0; pointer-events: none;
        }
        .about-deco-sq {
          position: absolute;
          border: 1px solid rgba(0,200,255,0.1);
          border-radius: 16px;
        }

        /* ── LEFT — PHOTO ── */
        .about-photo-wrap {
          flex-shrink: 0;
          position: relative;
          width: clamp(280px, 28vw, 420px);
        }

        .about-photo-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 4px;
          overflow: hidden;
          background: #0d1e30;
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* Photo placeholder — replace with <Image> */
        .about-photo-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(160deg, #0d2a3a 0%, #0a1a28 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
        }

        /* Corner crosshair like Carl */
        .photo-crosshair {
          position: absolute;
          top: 14px; left: 14px;
          width: 28px; height: 28px;
          color: rgba(255,255,255,0.4);
          font-size: 1.4rem;
          line-height: 1;
          z-index: 2;
        }

        /* Deco pixel dots on side */
        .about-deco-dots {
          position: absolute;
          right: -24px;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          grid-template-columns: repeat(2, 6px);
          gap: 6px;
        }
        .deco-dot {
          width: 6px; height: 6px;
          border-radius: 1px;
          background: var(--teal);
          opacity: 0.6;
        }
        /* alternate opacity for pattern */
        .deco-dot:nth-child(even) { opacity: 0.25; }

        /* Barcode strip bottom */
        .photo-barcode {
          position: absolute;
          bottom: 14px; left: 14px; right: 14px;
          height: 14px;
          background: repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.5) 0px,
            rgba(255,255,255,0.5) 2px,
            transparent 2px,
            transparent 5px,
            rgba(255,255,255,0.3) 5px,
            rgba(255,255,255,0.3) 6px,
            transparent 6px,
            transparent 9px
          );
          opacity: 0.35;
        }

        /* ── RIGHT — CONTENT ── */
        .about-content {
          flex: 1;
          max-width: 680px;
        }

        /* Section label */
        .about-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .about-label::before {
          content: '';
          display: block;
          width: 32px; height: 1px;
          background: var(--teal);
        }

        /* Title */
        .about-title {
          margin-bottom: 28px;
        }
        .about-title-clip {
          overflow: hidden;
          line-height: 1;
        }
        .about-title-line {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          line-height: 1;
          letter-spacing: -2px;
          color: var(--white);
          text-transform: uppercase;
          display: block;
          will-change: transform;
        }
        .about-title-line.outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.5);
        }
        /* The "+" between lines like Carl */
        .about-title-plus {
          font-family: var(--font-mono);
          font-size: 1.5rem;
          color: rgba(255,255,255,0.3);
          line-height: 1;
          display: block;
          margin: 6px 0;
        }

        /* Bio text */
        .about-bio {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          line-height: 1.85;
          color: rgba(255,255,255,0.65);
          max-width: 540px;
          margin-bottom: 36px;
          letter-spacing: 0.3px;
        }

        /* Location badge */
        .about-location {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-logo);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--white);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          width: 100%;
        }
        .location-icon {
          color: var(--teal);
          font-size: 1rem;
        }

        /* ── FLOATING 3D CROSS (sticky from hero) ── */
        .about-float-cross {
          position: absolute;
          right: 8%;
          top: 50%;
          transform: translateY(-50%);
          width: clamp(160px, 18vw, 260px);
          aspect-ratio: 1;
          pointer-events: none;
          opacity: 0.5;
          filter: blur(1px);
        }
        .afc-h, .afc-v {
          position: absolute;
          border-radius: 20px;
          background: linear-gradient(135deg, #00e5c8 0%, #0055ff 40%, #9b59b6 70%, #00cfff 100%);
        }
        .afc-h { width: 76%; height: 28%; top: 36%; left: 12%;
          box-shadow: 0 0 50px rgba(0,200,200,0.3); }
        .afc-v { width: 28%; height: 76%; top: 12%; left: 36%;
          box-shadow: 0 0 50px rgba(0,180,255,0.3); }
        .afc-c {
          position: absolute; width: 28%; height: 28%;
          top: 36%; left: 36%; border-radius: 14px;
          background: linear-gradient(135deg, #00e5c8, #0066ff);
          box-shadow: 0 0 60px rgba(0,160,255,0.7);
        }

        /* ── SIGNATURE (top right like Carl) ── */
        .about-signature {
          position: absolute;
          top: 60px; right: 80px;
          opacity: 0.25;
          width: 140px;
        }
        .about-signature svg {
          width: 100%;
          height: auto;
          stroke: var(--white);
          fill: none;
          stroke-width: 1.5;
        }
      `}</style>

      <section id="about" ref={sectionRef} className="about">
        <div className="about-grid" />

        {/* Deco squares — top right */}
        <div className="about-deco-squares">
          {[
            { w: 180, h: 140, top: "5%", right: "38%" },
            { w: 140, h: 110, top: "12%", right: "24%" },
            { w: 160, h: 130, top: "8%", right: "14%" },
            { w: 200, h: 160, top: "22%", right: "5%" },
            { w: 150, h: 120, bottom: "18%", right: "20%" },
            { w: 170, h: 140, bottom: "6%", right: "8%" },
          ].map((s, i) => (
            <div
              key={i}
              className="about-deco-sq"
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

        {/* Signature top right */}
        <div className="about-signature">
          <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10,60 C30,10 60,5 90,30 C110,50 130,20 160,25 C175,28 185,40 190,55"
              strokeLinecap="round"
            />
            <path d="M160,25 C165,20 175,15 185,18" strokeLinecap="round" />
          </svg>
        </div>

        {/* LEFT — Photo */}
        <div ref={photoRef} className="about-photo-wrap">
          <div className="about-photo-frame">
            {/* Replace this div with <Image src="/your-photo.jpg" fill alt="Douaa" style={{objectFit:'cover'}} /> */}
            <div className="about-photo-placeholder">Your Photo Here</div>
            <div className="photo-crosshair">⊕</div>
            <div className="photo-barcode" />
          </div>

          {/* Deco pixel dots */}
          <div ref={decoDotsRef} className="about-deco-dots">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="deco-dot" />
            ))}
          </div>
        </div>

        {/* RIGHT — Content */}
        <div className="about-content">
          <div className="about-label">01 — About</div>

          <div ref={titleRef} className="about-title">
            <div className="about-title-clip">
              <span className="about-title-line">Full-Stack</span>
            </div>
            <span className="about-title-plus">+</span>
            <div className="about-title-clip">
              <span className="about-title-line outline">Developer</span>
            </div>
          </div>

          <p ref={bioRef} className="about-bio">
            Douaa is a passionate full-stack developer specialised in crafting
            exceptional web experiences and interactions. Her eye for design and
            high level of craftsmanship have earned her a reputation for
            delivering excellent, polished work. She builds interfaces that
            compete with industry leaders and exceed expectations.
          </p>

          <div ref={locationRef} className="about-location">
            <span className="location-icon">✳</span>
            Based in Algiers, Algeria
          </div>
        </div>

        {/* Faint 3D cross — echoes the hero object */}
        <div className="about-float-cross">
          <div className="afc-h" />
          <div className="afc-v" />
          <div className="afc-c" />
        </div>
      </section>
    </>
  );
}
