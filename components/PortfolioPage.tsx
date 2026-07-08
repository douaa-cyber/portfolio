"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const NeuralShaderBackground = dynamic(
  () => import("./NeuralShaderBackground"),
  { ssr: false },
);
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function PortfolioPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navItems = [
    ["hero", "Project"],
    ["about", "Identity"],
    ["tech", "Stack"],
    ["work", "Archive"],
    ["contact", "Contact"],
  ] as const;

  return (
    <div className="bg-[#0a0d1c] text-[#dfe1f6] overflow-x-hidden min-h-screen">
      <div className="scanline-overlay" />
      <div ref={cursorRef} className="cursor-trail" />
      <NeuralShaderBackground />

      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-[#0f1321]/40">
        <nav className="max-w-[1280px] mx-auto px-5 md:px-16 py-4 flex justify-between items-center">
          <span className="font-mono text-sm font-bold text-[#7df4ff] bg-[#262939]/70 px-3 py-1.5 rounded tracking-widest">
            D.A_TERMINAL
          </span>

          <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`transition-colors duration-300 ${
                  id === "contact"
                    ? "text-[#7df4ff]"
                    : "text-[#b9cacb]/70 hover:text-[#dfe1f6]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#b9cacb] hover:text-[#00f0ff] cursor-pointer transition-colors hidden sm:block">
              terminal
            </span>
            <button
              onClick={() => scrollTo("contact")}
              className="bg-[#00f0ff] text-[#003d3f] px-5 py-2 rounded-full font-mono text-xs font-bold hover:scale-105 transition-transform tracking-widest"
            >
              Deploy
            </button>
            <button
              className="md:hidden text-[#b9cacb] hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f1321]/98 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-2">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left font-mono text-xs uppercase tracking-widest text-[#b9cacb] hover:text-[#7df4ff] transition-colors py-2 border-b border-white/5 last:border-0"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center px-5 md:px-16 max-w-[1280px] mx-auto pt-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[80vh]">
            <div className="md:col-span-7 flex flex-col gap-8 relative z-10 animate-fade-up">
              <div>
                <span className="font-mono text-[#7df4ff] tracking-widest mb-4 block opacity-70 uppercase text-xs">
                  Established // 2026 // System_Initiated
                </span>
                <h1 className="font-sans font-black leading-[1.05] text-[clamp(42px,8vw,88px)] tracking-[-0.04em] text-white">
                  DOUAA
                  <br />
                  <span
                    style={{
                      WebkitTextStroke: "1px rgba(125,244,255,0.4)",
                      color: "transparent",
                    }}
                  >
                    AGRAINE
                  </span>
                </h1>
              </div>

              <p className="font-sans text-lg text-[#b9cacb] max-w-lg leading-relaxed">
                Full Stack Software Engineer specializing in building immersive,
                high-performance digital ecosystems that bridge the gap between
                human and machine.
              </p>

              <div className="flex flex-wrap gap-3 font-mono text-xs text-[#7df4ff] items-center tracking-widest">
                {[
                  { icon: "code", label: "DESIGN" },
                  { icon: "terminal", label: "DEVELOPMENT" },
                  { icon: "token", label: "BRANDING" },
                ].map(({ icon, label }, i) => (
                  <span key={label} className="flex items-center gap-2">
                    {i > 0 && <span className="text-[#b9cacb]/20 mx-1">✦</span>}
                    <span className="flex items-center gap-2 bg-[#1b1f2e]/80 border border-white/[0.06] backdrop-blur px-4 py-2 rounded-full">
                      <span className="material-symbols-outlined text-sm">
                        {icon}
                      </span>
                      {label}
                    </span>
                  </span>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-6 flex-wrap">
                <button
                  onClick={() => scrollTo("work")}
                  className="bg-[#00f0ff] text-[#003d3f] px-8 py-4 rounded-full font-mono font-bold text-xs flex items-center gap-3 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all tracking-widest"
                >
                  SCROLL_TO_EXPLORE
                  <span className="material-symbols-outlined animate-bounce">
                    arrow_downward
                  </span>
                </button>
                <div className="flex items-center gap-4 text-[#b9cacb]/40 font-mono text-xs">
                  <div className="w-10 h-px bg-white/10" />
                  <span>Algiers, DZ</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 relative h-[360px] md:h-[500px]">
              <Hero3D />
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section
          id="about"
          className="py-32 px-5 md:px-16 max-w-[1280px] mx-auto"
        >
          <SectionHeader num="01" label="Log_Identity" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-16">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#00f0ff]/5 rounded-3xl blur-2xl group-hover:bg-[#00f0ff]/10 transition-colors duration-700" />
              <div className="relative glass-card rounded-3xl overflow-hidden aspect-square p-4">
                <img
                  alt="Douaa Agraine"
                  className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTLoHKQxNPu0HaJX_SmjdhFWvZRX4adMwtKbDVjg8nOE1BNuZVEAMclSgdkKeYh432hb0k4Jycxy9bfMSpdDLRv3UPWSCzN0oVL3mkJhDNtxC1X_w_h_m-4zzcGYrVTx9jLtBu3_4Q912nwi0b8dcRkxauXHIEp9dE9QeHrQEnHbl9QQky-VjVz1YerzVFhrijCdDrX63_MhYT9YnZ4u4asCcodjvCz3pE7siq3cebZboSFBaYcxAD7BTwsXrIOAp3yMafqHD6qfUF"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d1c] via-transparent to-transparent opacity-70 rounded-2xl" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="font-sans font-bold text-2xl text-white">
                    Douaa Agraine
                  </h3>
                  <p className="font-mono text-[#7df4ff] uppercase tracking-wider text-xs mt-1">
                    Lead System Architect
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <h2 className="font-sans font-bold text-3xl md:text-4xl text-white leading-tight">
                Engineering Digital Experiences Through Technical Rigor.
              </h2>
              <div className="space-y-5 font-sans text-[17px] text-[#b9cacb] leading-relaxed">
                <p>
                  My approach centers on &quot;Cinematic Engineering&quot;—the
                  intersection of flawless code and high-end aesthetic
                  execution. I focus on building scalable systems that
                  don&apos;t just work, but inspire.
                </p>
                <p>
                  From complex microservices architectures to high-fidelity
                  frontend interfaces, I treat every project as a unique piece
                  of digital architecture.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { value: "10+", label: "Projects_Deployed" },
                  { value: "02", label: "Years_Experience" },
                ].map(({ value, label }) => (
                  <div key={label} className="glass-card p-6 rounded-2xl">
                    <div className="text-[#7df4ff] text-4xl font-black font-sans">
                      {value}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#b9cacb]/50 mt-2">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/*  
        <section id="experience" className="py-32 px-5 md:px-16 max-w-[1280px] mx-auto">
          <SectionHeader num="02" label="Career_Stream" />

          <div className="space-y-6 mt-16">
            {[
              {
                period: '2024 — PRESENT',
                title: 'Principal Engineer',
                desc: 'Leading the development of a next-generation distributed trading platform. Focused on low-latency data processing and high-end visualization tools.',
                tags: ['RUST', 'KUBERNETES', 'WASM'],
                company: 'SYNTH_LABS',
              },
              {
                period: '2021 — 2023',
                title: 'Full Stack Lead',
                desc: 'Architected the core SaaS platform for AI-driven logistics. Reduced cloud infrastructure costs by 40% while doubling API throughput.',
                tags: ['TYPESCRIPT', 'AWS', 'REDIS'],
                company: 'NEXUS_INC',
              },
            ].map((exp) => (
              <div
                key={exp.company}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start glass-card p-7 md:p-10 rounded-2xl"
              >
                <div className="md:col-span-3">
                  <span className="font-mono text-[#7df4ff] text-xs tracking-wider">{exp.period}</span>
                  <h4 className="font-sans font-bold text-white text-xl mt-2">{exp.title}</h4>
                </div>
                <div className="md:col-span-6 space-y-4">
                  <p className="font-sans text-base text-[#b9cacb] leading-relaxed">{exp.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono border border-white/10 px-2.5 py-1 rounded-full text-[#b9cacb]/50 tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <span className="font-mono text-[#b9cacb]/30 text-xs tracking-widest">{exp.company}</span>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* ── Tech Stack ── */}
        <section
          id="tech"
          className="py-32 px-5 md:px-16 max-w-[1280px] mx-auto"
        >
          <SectionHeader num="02" label="Stack_Manifest" />
          <div className="mt-16">
            <TechTerminal />
          </div>
        </section>

        {/* ── Work / Archive ── */}
        <section
          id="work"
          className="py-32 px-5 md:px-16 max-w-[1280px] mx-auto"
        >
          <SectionHeader num="03" label="Archive_Selected" />

          <div className="flex flex-col mt-16 border-t border-white/[0.06]">
            {[
              {
                title: "Neural_Dashboard",
                desc: "Real-time brain-computer interface visualization engine.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuSpfqlA01CStR_CCi2RN8LQcOe63e0T_79nZyujl6Ah85B-oFpE0XIDcrBbey4f430IzXQyM24IoEypSMSHRHLOnvaB3myPXu2534m9MoUXrxrAbOEo6zDJpw9iWbTlS-dxyen2CUZWsiWRifbgHX9dlVKCcIKnqpbzh5Am9xsyBQT_665e21VabtG_QhHTQbL0NDDZIut4RVl_LG7VdAw3RNb4v7rAiyEY3y8-W58dUjqAmX7g_RRwsfpILMSe5DNwVCGz4-3WNO",
                tags: ["THREE.JS", "WEBGL", "REACT"],
                action: "VIEW_PROTOTYPE",
                actionIcon: "open_in_new",
              },
              {
                title: "Crypt_Node",
                desc: "High-frequency distributed ledger management node.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCahP_pKKYNyGBj3t3lDAScMTFJsX8uCE6gun7Ig1NX0887Nf064ab7bne_AZTIWBDTX4DddRnFCkDQBYH_gLDqus5S3R3Cm0xgAbWnuDz-oAuPJ0yOqXfgKHp_0ra9Eyjn_kIZKeChZwAKGNEr7EbF5bu7hfjokgCNKyqLquYn-d7Sz5MJRJCVlZAqkWZ0jbom8YHobxjAmfSzsyF6S-MYG0NFz_cV92FRVtTiEkDJc1TzrZIoXNe3mhxe3l2VDV4YK_8R6JjmgbME",
                tags: ["NODE.JS", "RUST", "GRPC"],
                action: "REPO_ACCESS",
                actionIcon: "code",
              },
            ].map(({ title, desc, img, tags, action, actionIcon }, i) => (
              <div
                key={title}
                className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-center py-10 border-b border-white/[0.06]"
              >
                <div className="md:col-span-1 hidden md:block">
                  <span className="font-mono text-[#b9cacb]/20 text-4xl font-black group-hover:text-[#00f0ff]/30 transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="md:col-span-6 flex flex-col gap-4 order-2 md:order-1">
                  <div>
                    <span className="font-mono text-[10px] text-[#7df4ff]/60 tracking-widest uppercase block mb-2">
                      $ cat ./projects/{title.toLowerCase()}.log
                    </span>
                    <h3 className="font-sans font-bold text-white text-2xl md:text-3xl group-hover:text-[#7df4ff] transition-colors duration-300">
                      {title}
                    </h3>
                  </div>
                  <p className="font-sans text-sm md:text-base text-[#b9cacb] leading-relaxed max-w-md">
                    {desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono border border-white/10 px-2.5 py-1 rounded-full text-[#00dbe9] tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="mt-3 w-fit flex items-center gap-3 font-mono text-xs font-bold text-[#0a0d1c] bg-white px-6 py-3 rounded-full hover:bg-[#00f0ff] transition-colors tracking-widest">
                    {action}
                    <span className="material-symbols-outlined text-sm">
                      {actionIcon}
                    </span>
                  </button>
                </div>

                <div className="md:col-span-5 order-1 md:order-2">
                  <div className="relative glass-card aspect-video rounded-2xl overflow-hidden">
                    <img
                      alt={title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      src={img}
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <button className="font-mono text-xs text-[#b9cacb] border border-white/10 px-10 py-4 rounded-full hover:bg-white/5 hover:text-white hover:border-white/20 transition-all flex items-center gap-4 tracking-widest">
              EXPLORE_FULL_ARCHIVE
              <span className="material-symbols-outlined text-sm">
                arrow_right_alt
              </span>
            </button>
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          id="contact"
          className="py-32 px-5 md:px-16 max-w-[1280px] mx-auto"
        >
          <div className="glass-card p-8 md:p-16 lg:p-20 rounded-[2.5rem] border border-[#00f0ff]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 blur-[120px] pointer-events-none" />

            <SectionHeader num="04" label="Connect_Sys" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
              <div className="flex flex-col gap-8">
                <h2 className="font-sans font-bold text-4xl md:text-5xl text-white leading-tight">
                  Let&apos;s Build the
                  <br />
                  Future Together.
                </h2>
                <p className="font-sans text-lg text-[#b9cacb] leading-relaxed">
                  Currently open to senior engineering roles, architectural
                  consulting, and high-impact collaborations.
                </p>
                <div className="flex flex-col gap-4 font-mono text-sm text-[#7df4ff]">
                  <a
                    href="mailto:terminal@douaa.tech"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <span className="material-symbols-outlined p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#00f0ff]/15 group-hover:border-[#00f0ff]/30 transition-all">
                      mail
                    </span>
                    <span className="group-hover:text-white transition-colors">
                      terminal@douaa.tech
                    </span>
                  </a>
                  <a href="#" className="flex items-center gap-4 group w-fit">
                    <span className="material-symbols-outlined p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#00f0ff]/15 group-hover:border-[#00f0ff]/30 transition-all">
                      alternate_email
                    </span>
                    <span className="group-hover:text-white transition-colors">
                      @douaa_agraine
                    </span>
                  </a>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 border-t border-white/5 bg-[#0a0d1c] relative z-10">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-[11px] text-[#b9cacb]/30 tracking-widest">
            ©2026_SYSTEM_OPERATIONAL // ALGIERS_BRANCH
          </span>
          <div className="flex gap-6 font-mono text-[11px] tracking-widest">
            {["GitHub", "LinkedIn", "Documentation", "Status"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[#b9cacb]/30 hover:text-[#7df4ff] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[#7df4ff] font-mono tracking-widest text-xs uppercase shrink-0">
        {num}. {label}
      </span>
      <div className="h-px flex-grow bg-gradient-to-r from-[#00f0ff]/30 to-transparent" />
    </div>
  );
}
function TechTerminal() {
  const stacks = {
    Frontend_Systems: {
      icon: "layers",
      items: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Three.js"],
    },
    Backend_Engines: {
      icon: "dns",
      items: ["Node.js", "Prisma", "Sequelize", "MySQL", "PostgreSQL"],
    },
  } as const;

  const [active, setActive] = useState<keyof typeof stacks>("Frontend_Systems");

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/[0.06]">
      {/* terminal chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0f1321]/60">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]/70" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/70" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]/70" />
        </div>
        <span className="font-mono text-[11px] text-[#b9cacb]/40 tracking-widest">
          stack_manifest.sh
        </span>
        <span className="w-16" />
      </div>

      {/* tabs */}
      <div className="flex border-b border-white/[0.06] font-mono text-xs tracking-widest">
        {(Object.keys(stacks) as (keyof typeof stacks)[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex items-center gap-2 px-6 py-4 border-r border-white/[0.06] transition-colors duration-300 ${
              active === key
                ? "text-[#7df4ff] bg-[#00f0ff]/[0.06]"
                : "text-[#b9cacb]/50 hover:text-[#b9cacb]"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {stacks[key].icon}
            </span>
            {key}
          </button>
        ))}
      </div>

      {/* body */}
      <div className="p-6 md:p-8 font-mono text-sm">
        <div className="text-[#b9cacb]/40 mb-4">
          <span className="text-[#7df4ff]">➜</span> ~/stack{" "}
          <span className="text-[#00dbe9]">--list</span> {active.toLowerCase()}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stacks[active].items.map((tech, i) => (
            <div
              key={tech}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#00f0ff]/30 transition-colors"
            >
              <span className="flex items-center gap-3 text-[#dfe1f6]">
                <span className="text-[#b9cacb]/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tech}
              </span>
              <span className="flex items-center gap-1.5 text-[#00dbe9] text-[10px] tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00dbe9] animate-pulse" />
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {[
        { key: "name", placeholder: "IDENTITY_NAME", type: "text" },
        { key: "email", placeholder: "CONTACT_EMAIL", type: "email" },
      ].map(({ key, placeholder, type }) => (
        <div key={key} className="relative">
          <input
            className="w-full bg-transparent border-0 border-b border-white/10 pb-3 pt-2 font-mono text-sm text-white focus:outline-none placeholder:text-[#b9cacb]/25 transition-colors focus:border-[#00f0ff]/50"
            placeholder={placeholder}
            type={type}
            value={formData[key as keyof typeof formData]}
            onChange={(e) =>
              setFormData((p) => ({ ...p, [key]: e.target.value }))
            }
            required
          />
        </div>
      ))}
      <div className="relative">
        <textarea
          className="w-full bg-transparent border-0 border-b border-white/10 pb-3 pt-2 font-mono text-sm text-white focus:outline-none placeholder:text-[#b9cacb]/25 transition-colors focus:border-[#00f0ff]/50 resize-none"
          placeholder="MESSAGE_PAYLOAD"
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData((p) => ({ ...p, message: e.target.value }))
          }
          required
        />
      </div>
      <button
        type="submit"
        className={`mt-6 px-10 py-4 rounded-full font-mono font-bold text-xs tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
          submitted
            ? "bg-emerald-400 text-emerald-900"
            : "bg-white text-[#0a0d1c] hover:bg-[#00f0ff] hover:text-[#003d3f] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
        }`}
      >
        {submitted ? (
          <>
            TRANSMITTED{" "}
            <span className="material-symbols-outlined">check_circle</span>
          </>
        ) : (
          <>
            TRANSMIT_DATA{" "}
            <span className="material-symbols-outlined">send</span>
          </>
        )}
      </button>
    </form>
  );
}
