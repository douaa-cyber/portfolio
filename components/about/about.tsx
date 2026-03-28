"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridBgRef = useRef<HTMLDivElement>(null);
  const decoSquaresRef = useRef<HTMLDivElement>(null);
  const floatCrossRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<SVGSVGElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const decoDotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mq.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(gridBgRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
        gsap.to(decoSquaresRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
        gsap.fromTo(
          floatCrossRef.current,
          { top: "50%", filter: "blur(1px)", opacity: 0.5 },
          {
            top: "38%",
            filter: "blur(0px)",
            opacity: 0.65,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          },
        );
        const paths = signatureRef.current?.querySelectorAll("path");
        paths?.forEach((path, i) => {
          const len = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2.2,
            delay: i * 0.15,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

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

      gsap.to(decoDotsRef.current, {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mq.revert();
    };
  }, []);

  return (
    <>
      <section id="about" ref={sectionRef} className="about section">
        <div ref={gridBgRef} className="grid-bg" />
        <div className="scanlines" />

        <div ref={decoSquaresRef} className="about-deco-squares">
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
                bottom: (s as any).bottom,
                right: s.right,
              }}
            />
          ))}
        </div>

        <div className="about-signature">
          <svg
            ref={signatureRef}
            viewBox="0 0 200 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10,60 C30,10 60,5 90,30 C110,50 130,20 160,25 C175,28 185,40 190,55"
              strokeLinecap="round"
            />
            <path d="M160,25 C165,20 175,15 185,18" strokeLinecap="round" />
          </svg>
        </div>

        <div ref={photoRef} className="about-photo-wrap">
          <div className="about-photo-frame">
            <div className="about-photo-placeholder"></div>
            <div className="photo-crosshair">⊕</div>
            <div className="photo-barcode" />
          </div>
          <div ref={decoDotsRef} className="about-deco-dots">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="deco-dot" />
            ))}
          </div>
        </div>

        <div className="about-content">
          <div className="about-label label">01 — About</div>

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

        <div ref={floatCrossRef} className="about-float-cross">
          <div className="afc-h" />
          <div className="afc-v" />
          <div className="afc-c" />
        </div>
      </section>
    </>
  );
}
