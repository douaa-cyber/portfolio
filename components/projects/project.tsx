"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    number: "01",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with real-time inventory, Stripe payments, and an admin dashboard. Built for scale with server-side rendering and optimistic UI.",
    stack: ["Next.js", "TypeScript", "Prisma", "MySQL"],
    color: "#00e5c8",
    bg: "linear-gradient(135deg, #041830 0%, #062a3a 60%, #063a2a 100%)",
    year: "2025",
    link: "#",
  },
  {
    number: "02",
    title: "Dev Portfolio CMS",
    description:
      "A headless CMS tailored for developer portfolios. Markdown-driven content, live preview, role-based auth, and a drag-and-drop project editor.",
    stack: ["React", "Node.js", "Express", "Sequelize"],
    color: "#0066ff",
    bg: "linear-gradient(135deg, #041830 0%, #061a3a 60%, #061030 100%)",
    year: "2025",
    link: "#",
  },
  {
    number: "03",
    title: "Real-Time Chat App",
    description:
      "WebSocket-powered messaging platform with rooms, read receipts, file uploads and end-to-end encryption. Handles 10k+ concurrent connections.",
    stack: ["Next.js", "Node.js", "MySQL", "TypeScript"],
    color: "#9b59b6",
    bg: "linear-gradient(135deg, #041830 0%, #1a0630 60%, #0a0420 100%)",
    year: "2024",
    link: "#",
  },
  {
    number: "04",
    title: "Analytics Dashboard",
    description:
      "Interactive data visualization suite for SaaS metrics. Custom chart library, live WebSocket feeds, CSV export and white-label theming.",
    stack: ["React", "TypeScript", "Tailwind", "Express"],
    color: "#F7DF1E",
    bg: "linear-gradient(135deg, #041830 0%, #1a1203 60%, #0d0a00 100%)",
    year: "2024",
    link: "#",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const total = cards.length;

      // Initial stacked state — each card offset slightly
      cards.forEach((card, i) => {
        const offset = (total - 1 - i) * 18; // vertical stack offset
        const scale = 1 - (total - 1 - i) * 0.04; // scale down cards beneath
        gsap.set(card, {
          y: offset,
          scale,
          zIndex: i + 1,
          transformOrigin: "top center",
        });
      });

      // For each card except the last, create a scroll-triggered peel
      const VH = window.innerHeight;
      const step = VH; // one full viewport per card peel

      cards.forEach((card, i) => {
        if (i === total - 1) return; // last card stays

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => `top+=${i * step}px top`,
          end: () => `top+=${(i + 1) * step}px top`,
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;

            // This card peels up, tilts, fades out
            gsap.set(card, {
              y: -180 * p,
              x: -50 * p,
              rotation: -10 * p,
              opacity: 1 - p,
              scale: 1 - 0.08 * p,
              zIndex: total + 1,
            });

            // Cards beneath bubble up progressively
            for (let j = i + 1; j < total; j++) {
              const baseOffset = (total - 1 - j) * 18;
              const targetOffset = Math.max(0, baseOffset - p * 18);
              const baseScale = 1 - (total - 1 - j) * 0.04;
              const targetScale = Math.min(1, baseScale + p * 0.04);
              gsap.set(cards[j], { y: targetOffset, scale: targetScale });
            }
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Space+Mono:wght@400;700&family=Oxanium:wght@700;800&display=swap');

        /* ── SECTION ── */
        .projects-section {
          position: relative;
          /* sticky viewport + 100vh per card to peel */
          height: calc(100vh * 5);
          width: 100%;
          background:
            radial-gradient(ellipse 90% 70% at 20% 60%, rgba(0,80,200,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 70% 30%, rgba(0,160,140,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 80%, rgba(0,40,120,0.4) 0%, transparent 60%),
            linear-gradient(160deg, #041830 0%, #062a3a 40%, #041e30 70%, #030e1a 100%);
          font-family: 'Space Mono', monospace;
          color: #f0f4ff;
        }

        .projects-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,200,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.07) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%);
        }
        .projects-scanlines {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.022) 2px, rgba(0,0,0,0.022) 4px
          );
        }

        /* ── STICKY CONTAINER ── */
        .projects-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 60px;
          overflow: hidden;
          z-index: 10;
        }

        /* ── HEADER ── */
        .projects-header {
          margin-bottom: 52px; flex-shrink: 0;
        }
        .projects-label {
          font-size: 0.6rem; letter-spacing: 5px; text-transform: uppercase;
          color: #00e5c8; display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
        }
        .projects-label::before { content:''; display:block; width:32px; height:1px; background:#00e5c8; }
        .projects-title {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          line-height: 0.95; letter-spacing: -2px; text-transform: uppercase;
          display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;
        }
        .projects-title-solid  { color: #f0f4ff; }
        .projects-title-outline { color: transparent; -webkit-text-stroke: 1.5px rgba(0,229,200,0.7); }

        /* ── CARD STACK AREA ── */
        .card-stack {
          position: relative;
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
          height: 340px; /* fixed height — cards are absolutely positioned inside */
        }

        /* ── PROJECT CARD ── */
        .project-card {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: rgba(10, 22, 40, 0.92);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 36px 40px;
          backdrop-filter: blur(12px);
          will-change: transform, opacity;
          cursor: default;
          overflow: hidden;
          box-shadow:
            0 8px 40px rgba(0,0,0,0.5),
            0 0 0 0.5px rgba(255,255,255,0.05) inset;
        }

        /* Gradient left border accent */
        .project-card::before {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 3px; height: 100%;
          border-radius: 20px 0 0 20px;
          background: var(--card-color);
          box-shadow: 0 0 20px var(--card-color);
        }

        /* Subtle noise texture */
        .project-card::after {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: var(--card-bg);
          opacity: 0.3;
          z-index: 0;
        }

        .card-inner { position: relative; z-index: 1; }

        .card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .card-number {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 4rem; font-weight: 800; line-height: 1;
          letter-spacing: -3px;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.12);
        }

        .card-year-link {
          display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
        }
        .card-year {
          font-size: 0.6rem; letter-spacing: 4px; color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }
        .card-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase;
          color: var(--card-color);
          border: 1px solid var(--card-color);
          padding: 7px 16px; border-radius: 20px;
          transition: background 0.25s, color 0.25s;
          text-decoration: none;
          font-family: 'Space Mono', monospace; font-weight: 700;
        }
        .card-link:hover { background: var(--card-color); color: #041830; }
        .card-link-arrow { font-size: 0.8rem; }

        .card-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 800; letter-spacing: -0.5px;
          color: #f0f4ff; margin-bottom: 12px;
          line-height: 1.1;
        }

        .card-desc {
          font-size: 0.75rem; line-height: 1.75;
          color: rgba(255,255,255,0.55);
          max-width: 560px; margin-bottom: 24px;
        }

        .card-stack-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .card-tag {
          font-size: 0.58rem; letter-spacing: 2.5px; text-transform: uppercase;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 5px 12px; border-radius: 20px;
          transition: border-color 0.2s, color 0.2s;
        }
        .project-card:hover .card-tag {
          border-color: var(--card-color);
          color: var(--card-color);
        }

        /* scroll hint */
        .projects-scroll-hint {
          margin-top: 28px; flex-shrink: 0;
          display: flex; align-items: center; gap: 14px;
          font-size: 0.62rem; letter-spacing: 5px; text-transform: uppercase;
          color: rgba(255,255,255,0.25); font-weight: 700;
        }
        .projects-scroll-hint::before {
          content: ''; display: block; width: 32px; height: 1px;
          background: rgba(255,255,255,0.15);
        }

        /* Ghost counter */
        .projects-counter {
          position: absolute; top: 60px; right: 60px; z-index: 2;
          text-align: right; pointer-events: none;
        }
        .projects-counter-num {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
          font-size: clamp(5rem, 10vw, 9rem); line-height: 1; letter-spacing: -4px;
          color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.05);
        }
        .projects-counter-label {
          font-size: 0.5rem; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(255,255,255,0.1);
        }

        /* Deco cross */
        .projects-deco-cross {
          position: absolute; bottom: 8vh; left: 5%;
          width: clamp(80px, 10vw, 140px); aspect-ratio: 1;
          pointer-events: none; opacity: 0.15; filter: blur(2px);
        }
        .pdc-h, .pdc-v { position: absolute; border-radius: 12px; background: linear-gradient(135deg, #00e5c8, #0055ff); }
        .pdc-h { width: 76%; height: 28%; top: 36%; left: 12%; }
        .pdc-v { width: 28%; height: 76%; top: 12%; left: 36%; }
        .pdc-c { position: absolute; width: 26%; height: 26%; top: 37%; left: 37%; border-radius: 8px; background: linear-gradient(135deg, #00e5c8, #0066ff); box-shadow: 0 0 30px rgba(0,160,255,0.8); }
      `}</style>

      <section id="work" ref={sectionRef} className="projects-section">
        <div className="projects-grid-bg" />
        <div className="projects-scanlines" />

        <div className="projects-counter">
          <div className="projects-counter-num">04</div>
          <div className="projects-counter-label">Projects</div>
        </div>

        <div ref={stickyRef} className="projects-sticky">
          {/* Header */}
          <div ref={titleRef} className="projects-header">
            <div className="projects-label">03 — Work</div>
            <div className="projects-title">
              <span className="projects-title-solid">Selected</span>
              <span className="projects-title-outline">Projects</span>
            </div>
          </div>

          {/* Card Stack */}
          <div className="card-stack">
            {PROJECTS.map((project, i) => (
              <div
                key={project.number}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="project-card"
                style={{
                  // @ts-ignore
                  "--card-color": project.color,
                  "--card-bg": project.bg,
                }}
              >
                <div className="card-inner">
                  <div className="card-top">
                    <div className="card-number">{project.number}</div>
                    <div className="card-year-link">
                      <span className="card-year">{project.year}</span>
                      <a href={project.link} className="card-link">
                        View <span className="card-link-arrow">↗</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-title">{project.title}</div>
                  <p className="card-desc">{project.description}</p>
                  <div className="card-stack-tags">
                    {project.stack.map((tag) => (
                      <span key={tag} className="card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="projects-scroll-hint">Scroll to explore projects</div>
        </div>

        <div className="projects-deco-cross">
          <div className="pdc-h" />
          <div className="pdc-v" />
          <div className="pdc-c" />
        </div>
      </section>
    </>
  );
}
