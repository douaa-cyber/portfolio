"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BottomNavProps {
  sections?: string[];
}

export default function BottomNav({
  sections = ["about", "stats", "work"],
}: BottomNavProps) {
  const bottomNavRef = useRef<HTMLElement>(null);
  const scrollFillRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navLinks = Array.from(
      bottomNavRef.current?.querySelectorAll<HTMLElement>(".bn-link") || [],
    );

    const activateLink = (index: number) => {
      navLinks.forEach((l, i) => {
        if (i === index) {
          l.classList.add("active");
          if (
            highlightRef.current &&
            scrollFillRef.current &&
            bottomNavRef.current
          ) {
            const navRect = bottomNavRef.current.getBoundingClientRect();
            const linkRect = l.getBoundingClientRect();

            // Highlight pill animation
            gsap.to(highlightRef.current, {
              x: linkRect.left - navRect.left,
              width: linkRect.width,
              duration: 0.4,
              ease: "power3.out",
            });

            // Fill animation up to this link
            gsap.to(scrollFillRef.current, {
              width: linkRect.right - navRect.left,
              duration: 0.4,
              ease: "power3.out",
            });
          }
        } else {
          l.classList.remove("active");
        }
      });
    };

    sections.forEach((secId, i) => {
      const el = document.getElementById(secId);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => activateLink(i),
        onEnterBack: () => activateLink(i),
        onLeaveBack: () => {
          // If we scroll back above the first section, reset fill
          if (i === 0 && scrollFillRef.current && highlightRef.current) {
            gsap.to(scrollFillRef.current, { width: 0, duration: 0.3 });
            gsap.to(highlightRef.current, { width: 0, duration: 0.3 });
            navLinks.forEach((l) => l.classList.remove("active"));
          }
        },
      });
    });
  }, [sections]);

  return (
    <nav ref={bottomNavRef} className="bottom-nav">
      <div ref={scrollFillRef} className="bn-scroll-fill" />
      <div ref={highlightRef} className="bn-highlight" />

      <div className="bn-logo-box">
        <span>D.A</span>
      </div>

      <div className="bn-links">
        {sections.map((sec, i) => (
          <div key={sec} className="bn-link" data-section={sec}>
            <span className="bn-num">{`0${i + 1}.`}</span>{" "}
            {sec.charAt(0).toUpperCase() + sec.slice(1)}
            {i < sections.length - 1 && <span className="bn-sep">✳︎</span>}
          </div>
        ))}
      </div>
    </nav>
  );
}
