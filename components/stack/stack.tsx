"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STACK = [
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          transform="rotate(120 12 12)"
        />
      </svg>
    ),
    color: "#61DAFB",
  },
  {
    name: "Next.js",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0z" />
      </svg>
    ),
    color: "#ffffff",
  },
  {
    name: "TypeScript",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
    color: "#3178C6",
  },
  {
    name: "JavaScript",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
      </svg>
    ),
    color: "#F7DF1E",
  },
  {
    name: "Tailwind",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
    color: "#06B6D4",
  },
  {
    name: "Node.js",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.998.001a.998.998 0 0 0-.499.131L.502 6.131A1 1 0 0 0 0 7v10a1 1 0 0 0 .502.868l11.002 6c.31.168.685.168.995 0l11-6A1 1 0 0 0 24 17V7a1 1 0 0 0-.502-.868L12.497.132a.998.998 0 0 0-.499-.131zm-.04 4.55c3.21 0 5.038 1.35 5.038 3.738 0 2.539-1.828 3.249-5.066 3.578-3.446.359-3.566.895-3.566 1.618 0 .744.806 1.23 2.15 1.23 1.933 0 3.35-.54 4.087-1.618v2.808c-.778.688-2.034 1.095-3.877 1.095-2.987 0-4.665-1.23-4.665-3.458 0-2.449 1.588-3.129 4.934-3.459 2.898-.298 3.368-.597 3.368-1.23 0-.65-.745-1.051-1.947-1.051-1.678 0-2.868.56-3.503 1.618V6.548c.715-.447 1.979-.895 3.503-.895l-.456-.1z" />
      </svg>
    ),
    color: "#339933",
  },
  {
    name: "Express",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 18.588a1.529 1.529 0 0 1-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 0 0 2.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 0 1-2.589 3.957 6.272 6.272 0 0 1-7.306-.933 6.575 6.575 0 0 1-1.64-3.858c-.061-.298-.074-.138-.139-.826zm1.014-.141h9.748c-.387-3.244-2.964-4.653-5.315-3.422a5.21 5.21 0 0 0-4.433 3.422z" />
      </svg>
    ),
    color: "#ffffff",
  },
  {
    name: "MySQL",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.274.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 0 0-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 0 0-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.09 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.357-.622zM14.5 17.588c-.173.501-.496.752-.971.752-.296 0-.527-.125-.69-.376-.185-.266-.276-.698-.276-1.295 0-.633.1-1.108.3-1.424.178-.285.435-.427.77-.427.443 0 .753.188.932.566.16.34.24.822.24 1.447-.001.678-.1 1.153-.305 1.757z" />
      </svg>
    ),
    color: "#4479A1",
  },
  {
    name: "Prisma",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7065-1.1286-.7065-.0668 0-.1335.006-.1986.0182-.5522.1016-.9518.5822-.9518 1.1398V22c0 .5576.3996 1.0382.9518 1.1398.0651.012.132.018.1986.018.4896 0 .9216-.2683 1.1286-.7065l8.254-17.5283c.207-.4382.207-.9565 0-1.3947zM2.1932 21.7565c.207.4382.639.7065 1.1286.7065.0668 0 .1335-.006.1986-.0182.5522-.1016.9518-.5822.9518-1.1398V2c0-.5576-.3996-1.0382-.9518-1.1398A1.532 1.532 0 0 0 3.3218.842c-.4896 0-.9216.2683-1.1286.7065L.0932 19.0617c-.1243.2636-.1243.5615 0 .8251l2.1 1.8697z" />
      </svg>
    ),
    color: "#5a67d8",
  },
  {
    name: "Sequelize",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    ),
    color: "#52B0E7",
  },
  {
    name: "GitHub",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    color: "#ffffff",
  },
];

const ROW1 = STACK.slice(0, 6); // React, Next, TS, JS, Tailwind, Node
const ROW2 = STACK.slice(6); // Express, MySQL, Prisma, Sequelize, GitHub

// Single card component
function TechCard({ tech }: { tech: (typeof STACK)[0] }) {
  return (
    <div className="stack-card">
      <div className="stack-card-icon" style={{ color: tech.color }}>
        {tech.icon}
      </div>
      <span className="stack-card-name">{tech.name}</span>
    </div>
  );
}

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Space+Mono:wght@400;700&family=Oxanium:wght@700;800&display=swap');

        /* ── SECTION ── */
        .stack-section {
          position: relative;
          min-height: 100svh;
          width: 100%;
          overflow: hidden;
          background:
            radial-gradient(ellipse 90% 70% at 20% 60%, rgba(0,80,200,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 70% 30%, rgba(0,160,140,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 80%, rgba(0,40,120,0.4) 0%, transparent 60%),
            linear-gradient(160deg, #041830 0%, #062a3a 40%, #041e30 70%, #030e1a 100%);
          padding: 120px 0 120px;
          font-family: 'Space Mono', monospace;
          color: #f0f4ff;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .stack-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,200,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.07) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%);
        }
        .stack-scanlines {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.022) 2px, rgba(0,0,0,0.022) 4px
          );
        }

        /* ── HEADER ── */
        .stack-header {
          position: relative; z-index: 10;
          padding: 0 60px;
          margin-bottom: 20px;
        }
        .stack-label {
          font-size: 0.6rem; letter-spacing: 5px; text-transform: uppercase;
          color: #00e5c8; display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .stack-label::before { content: ''; display: block; width: 32px; height: 1px; background: #00e5c8; }
        .stack-title {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
          font-size: clamp(3rem, 7vw, 6.5rem);
          line-height: 0.95; letter-spacing: -2px; text-transform: uppercase;
          display: flex; align-items: baseline; gap: 24px; flex-wrap: wrap;
        }
        .stack-title-solid { color: #f0f4ff; }
        .stack-title-outline { color: transparent; -webkit-text-stroke: 1.5px rgba(0,229,200,0.7); }

        .stack-divider {
          width: calc(100% - 120px); height: 1px; margin: 28px 60px 60px;
          background: linear-gradient(90deg, #00e5c8, rgba(0,102,255,0.5), transparent);
          transform-origin: left; position: relative; z-index: 10;
        }

        /* ── MARQUEE ── */
        .stack-marquee-wrap {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; gap: 22px;
          /* edge fade */
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%);
        }

        .marquee-track {
          overflow: hidden; width: 100%;
        }

        .marquee-inner {
          display: flex; align-items: center;
          gap: 16px;
          width: max-content;
          will-change: transform;
        }

        /* Row 1: scrolls left */
        .marquee-inner.row-ltr {
          animation: marquee-left 30s linear infinite;
        }
        /* Row 2: scrolls right */
        .marquee-inner.row-rtl {
          animation: marquee-right 36s linear infinite;
        }

        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        /* Pause entire marquee on hover */
        .stack-marquee-wrap:hover .marquee-inner {
          animation-play-state: paused;
        }

        /* ── CARD ── */
        .stack-card {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 26px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          white-space: nowrap; flex-shrink: 0;
          transition: background 0.25s, border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          cursor: default;
        }
        .stack-card:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }

        .stack-card-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: filter 0.3s, transform 0.3s;
        }
        .stack-card:hover .stack-card-icon {
          filter: drop-shadow(0 0 10px currentColor);
          transform: scale(1.18) rotate(-6deg);
        }

        .stack-card-name {
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          transition: color 0.25s;
        }
        .stack-card:hover .stack-card-name { color: #fff; }

        /* ✦ separator pill between cards */
        .marquee-sep {
          color: rgba(0,229,200,0.25);
          font-size: 1.1rem;
          flex-shrink: 0;
          line-height: 1;
          user-select: none;
        }

        /* ── GHOST COUNTER ── */
        .stack-counter {
          position: absolute; top: 100px; right: 60px; z-index: 2;
          text-align: right; pointer-events: none;
        }
        .stack-counter-num {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800; font-size: clamp(5rem, 10vw, 9rem);
          line-height: 1; letter-spacing: -4px;
          color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.06);
        }
        .stack-counter-label {
          font-size: 0.5rem; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(255,255,255,0.12);
        }

        /* ── DECO CROSS ── */
        .stack-deco-cross {
          position: absolute; bottom: 5%; right: 3%;
          width: clamp(100px, 12vw, 180px); aspect-ratio: 1;
          pointer-events: none; opacity: 0.18; filter: blur(2px);
        }
        .sdc-h, .sdc-v { position: absolute; border-radius: 16px; background: linear-gradient(135deg, #00e5c8, #0055ff); }
        .sdc-h { width: 76%; height: 28%; top: 36%; left: 12%; }
        .sdc-v { width: 28%; height: 76%; top: 12%; left: 36%; }
        .sdc-c { position: absolute; width: 26%; height: 26%; top: 37%; left: 37%; border-radius: 10px; background: linear-gradient(135deg, #00e5c8, #0066ff); box-shadow: 0 0 40px rgba(0,160,255,0.8); }
      `}</style>

      <section id="stats" ref={sectionRef} className="stack-section">
        <div className="stack-grid-bg" />
        <div className="stack-scanlines" />

        <div className="stack-counter">
          <div className="stack-counter-num">11</div>
          <div className="stack-counter-label">Technologies</div>
        </div>

        {/* Header */}
        <div ref={titleRef} className="stack-header">
          <div className="stack-label">02 — Tech Stack</div>
          <div className="stack-title">
            <span className="stack-title-solid">My</span>
            <span className="stack-title-outline">Arsenal</span>
          </div>
        </div>

        <div ref={lineRef} className="stack-divider" />

        {/* Two infinite marquee rows */}
        <div className="stack-marquee-wrap">
          {/* Row 1 → left */}
          <div className="marquee-track">
            <div className="marquee-inner row-ltr">
              {[...ROW1, ...ROW1, ...ROW1, ...ROW1].map((tech, i) => (
                <div key={`r1-${i}`} style={{ display: "contents" }}>
                  <TechCard tech={tech} />
                  <span className="marquee-sep">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 → right */}
          <div className="marquee-track">
            <div className="marquee-inner row-rtl">
              {[...ROW2, ...ROW2, ...ROW2, ...ROW2].map((tech, i) => (
                <div key={`r2-${i}`} style={{ display: "contents" }}>
                  <TechCard tech={tech} />
                  <span className="marquee-sep">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deco cross */}
        <div className="stack-deco-cross">
          <div className="sdc-h" />
          <div className="sdc-v" />
          <div className="sdc-c" />
        </div>
      </section>
    </>
  );
}
