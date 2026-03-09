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
      <section id="work" ref={sectionRef} className="projects-section section">
        <div className="grid-bg" />
        <div className="scanlines" />

        <div className="projects-counter">
          <div className="projects-counter-num">04</div>
          <div className="projects-counter-label">Projects</div>
        </div>

        <div ref={stickyRef} className="projects-sticky">
          {/* Header */}
          <div ref={titleRef} className="projects-header">
            <div className="projects-label label">03 — Work</div>
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
