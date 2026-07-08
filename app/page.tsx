"use client";

import { useEffect, useRef, useState } from "react";

// ─── helpers ──────────────────────────────────────────────────────────────────
const d = (ms: number) => ({ "--sr-d": `${ms}ms` }) as React.CSSProperties;

// ─── Cursor glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(0,240,255,0.8) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%,-50%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

// ─── Neural shader canvas ─────────────────────────────────────────────────────
function NeuralBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    const sync = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", sync);
    sync();
    const vs = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0,1);}`;
    const fs = `precision highp float;uniform float t;uniform vec2 r;varying vec2 v;
    float rnd(vec2 s){return fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);}
    void main(){vec2 u=v;vec2 c=(u-.5)*2.;c.x*=r.x/r.y;vec3 col=vec3(.04,.05,.1);
    float l=0.;for(float i=1.;i<4.;i++){float tt=t*(.05+i*.02);float x=sin(c.y*2.+tt)*.5;
    float dist=abs(c.x-x-(i-2.)*.8);l+=smoothstep(.02,.0,dist)*(.5+.5*sin(tt+i));}
    col+=vec3(0.,.86,1.)*l*.4;float n=rnd(u+t*.005);if(n>.99)col+=vec3(0.,1.,1.)*.3;
    gl_FragColor=vec4(col,1.);}`;
    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "t"),
      uR = gl.getUniformLocation(prog, "r");
    let raf = 0;
    const draw = (ts: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uT, ts * 0.001);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sync);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Hero 3D ──────────────────────────────────────────────────────────────────
function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let raf = 0,
      mx = 0,
      my = 0;
    import("three").then((THREE) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        c.clientWidth / c.clientHeight,
        0.1,
        1000,
      );
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(c.clientWidth, c.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      c.appendChild(renderer.domElement);
      const group = new THREE.Group();
      scene.add(group);
      const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xdbfcff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.2,
      });
      const glow = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.7,
      });
      const cubes: { g: any; spd: number }[] = [];
      for (let i = 0; i < 12; i++) {
        const cg = new THREE.Group();
        cg.add(new THREE.Mesh(geo, mat));
        cg.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), glow));
        cg.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
        );
        cg.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        );
        group.add(cg);
        cubes.push({ g: cg, spd: 0.002 + Math.random() * 0.005 });
      }
      scene.add(new THREE.PointLight(0x00f0ff, 2.5, 15));
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      camera.position.z = 10;
      const onM = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 1.5;
        my = (e.clientY / window.innerHeight - 0.5) * 1.5;
      };
      const onR = () => {
        camera.aspect = c.clientWidth / c.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(c.clientWidth, c.clientHeight);
      };
      window.addEventListener("mousemove", onM);
      window.addEventListener("resize", onR);
      const anim = () => {
        raf = requestAnimationFrame(anim);
        group.rotation.y += (mx - group.rotation.y) * 0.05;
        group.rotation.x += (my - group.rotation.x) * 0.05;
        cubes.forEach((cu) => {
          cu.g.rotation.z += cu.spd;
          cu.g.position.y +=
            Math.sin(Date.now() * 0.001 + cu.g.position.x) * 0.003;
        });
        renderer.render(scene, camera);
      };
      anim();
      (c as any).__cl = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onM);
        window.removeEventListener("resize", onR);
        renderer.dispose();
        if (renderer.domElement.parentNode === c)
          c.removeChild(renderer.domElement);
      };
    });
    return () => {
      cancelAnimationFrame(raf);
      (c as any).__cl?.();
    };
  }, []);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [ok, setOk] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOk(true);
    setTimeout(() => setOk(false), 3000);
    setF({ name: "", email: "", message: "" });
  };
  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    padding: "12px 0",
    fontFamily: "monospace",
    fontSize: 13,
    color: "#fff",
    outline: "none",
    width: "100%",
  };
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
      onSubmit={submit}
    >
      {(["name", "email"] as const).map((k) => (
        <input
          key={k}
          type={k === "email" ? "email" : "text"}
          placeholder={k === "name" ? "IDENTITY_NAME" : "CONTACT_EMAIL"}
          value={f[k]}
          onChange={(e) => setF((p) => ({ ...p, [k]: e.target.value }))}
          required
          style={inputStyle}
        />
      ))}
      <textarea
        placeholder="MESSAGE_PAYLOAD"
        value={f.message}
        onChange={(e) => setF((p) => ({ ...p, message: e.target.value }))}
        required
        rows={4}
        style={{ ...inputStyle, resize: "none" }}
      />
      <button
        type="submit"
        style={{
          marginTop: 20,
          padding: "15px 40px",
          borderRadius: 9999,
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          cursor: "pointer",
          border: "none",
          background: ok ? "#34d399" : "#fff",
          color: ok ? "#064e3b" : "#0a0d1c",
          transition: "all .3s",
        }}
      >
        {ok ? "TRANSMITTED ✓" : "TRANSMIT_DATA →"}
      </button>
    </form>
  );
}

// ─── Tech marquee (bandes de logos défilant en boucle horizontale) ───────────
function TechGrid({
  C,
  card,
  mono,
}: {
  C: any;
  card: React.CSSProperties;
  mono: React.CSSProperties;
}) {
  const groups = [
    {
      label: "Frontend_Systems",
      color: "#61dafb",
      direction: "left" as const,
      speed: 32,
      items: [
        {
          name: "React",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          name: "Next.js",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        },
        {
          name: "Tailwind CSS",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        },
        {
          name: "TypeScript",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
        {
          name: "JavaScript",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        },
      ],
    },
    {
      label: "Backend_Engines",
      color: "#00f0ff",
      direction: "right" as const,
      speed: 38,
      items: [
        {
          name: "Node.js",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        },
        {
          name: "Prisma",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
        },
        {
          name: "Sequelize",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg",
        },
        {
          name: "MySQL",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        },
        {
          name: "PostgreSQL",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        },
      ],
    },
    {
      label: "Tools_And_Ops",
      color: "#ff8a00",
      direction: "left" as const,
      speed: 42,
      items: [
        {
          name: "Git",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        },
        {
          name: "TanStack Query",
          logo: "https://api.iconify.design/logos/react-query.svg",
        },
        {
          name: "Docker",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      <style>{`
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .marquee-row:hover .marquee-track { animation-play-state: paused; }
      `}</style>
      {groups.map((group) => (
        <div key={group.label}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: group.color,
                boxShadow: `0 0 12px ${group.color}`,
              }}
            />
            <span
              style={{
                ...mono,
                fontSize: 12,
                color: C.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {group.label}
            </span>
          </div>

          <div
            className="marquee-row"
            style={{
              position: "relative",
              overflow: "hidden",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)",
            }}
          >
            <div
              className="marquee-track"
              style={{
                display: "flex",
                width: "max-content",
                gap: 16,
                animation: `marquee-${group.direction} ${group.speed}s linear infinite`,
              }}
            >
              {[...group.items, ...group.items].map((tech, i) => (
                <div
                  key={`${tech.name}-${i}`}
                  style={{
                    ...card,
                    width: 140,
                    flexShrink: 0,
                    padding: "24px 12px",
                    borderRadius: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    transition:
                      "border-color .35s ease, box-shadow .35s ease, transform .35s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = group.color;
                    e.currentTarget.style.boxShadow = `0 0 34px ${group.color}44`;
                    e.currentTarget.style.transform =
                      "translateY(-6px) scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    style={{ width: 42, height: 42, objectFit: "contain" }}
                  />
                  <span
                    style={{
                      ...mono,
                      fontSize: 11,
                      color: C.text,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Identity panel (remplace la photo) ───────────────────────────────────────
function IdentityPanel({
  C,
  card,
  mono,
}: {
  C: any;
  card: React.CSSProperties;
  mono: React.CSSProperties;
}) {
  const rows = [
    ["STATUS", "ONLINE", "#34d399"],
    ["ROLE", "Full Stack", C.cyanDim],
    ["LOCATION", "ALGIERS, DZ", C.cyanDim],
    ["UPTIME", "02 YEARS", C.cyanDim],
  ] as const;
  return (
    <div
      style={{
        ...card,
        borderRadius: 24,
        padding: 40,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        justifyContent: "center",
        minHeight: 420,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          background: "rgba(0,240,255,0.08)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />
      <div>
        <div style={{ fontWeight: 700, fontSize: 26, color: "#fff" }}>
          Douaa Agraine
        </div>
        <div
          style={{
            ...mono,
            fontSize: 11,
            color: C.cyanDim,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginTop: 6,
          }}
        >
          Full_Stack.exe
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {rows.map(([label, value, color]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              paddingBottom: 10,
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: 11,
                color: `${C.muted}80`,
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                ...mono,
                fontSize: 12,
                color,
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {label === "STATUS" && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />
              )}
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
  C,
  card,
  mono,
}: {
  project: any;
  onClick: () => void;
  C: any;
  card: React.CSSProperties;
  mono: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        ...card,
        padding: 0,
        borderRadius: 24,
        cursor: "pointer",
        transition: "transform .35s ease, box-shadow .35s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,240,255,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          overflow: "hidden",
          borderRadius: "24px 24px 0 0",
        }}
      >
        <img
          alt={project.title}
          src={project.img}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,13,28,0.92) 0%, rgba(10,13,28,0.1) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            ...card,
            padding: "8px 14px",
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid rgba(0,240,255,0.25)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, color: C.cyanDim }}
          >
            visibility
          </span>
          <span
            style={{
              ...mono,
              fontSize: 10,
              color: C.cyanDim,
              letterSpacing: "0.08em",
            }}
          >
            VIEW
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 24,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 22, color: "#fff" }}>
            {project.title}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            {project.desc}
          </div>
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}
          >
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  ...mono,
                  fontSize: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "3px 10px",
                  borderRadius: 9999,
                  color: "#00dbe9",
                  letterSpacing: "0.08em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Project modal ─────────────────────────────────────────────────────────────
function ProjectModal({ project, tab, setTab, onClose, C, card, mono }: any) {
  const [zoomed, setZoomed] = useState<string | null>(null);

  // Reset zoom whenever the modal is closed or the project changes
  useEffect(() => {
    setZoomed(null);
  }, [project]);

  if (!project) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(10,13,28,0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...card,
          width: "100%",
          maxWidth: 920,
          maxHeight: "85vh",
          overflowY: "auto",
          padding: 0,
          borderRadius: 28,
          border: "1px solid rgba(0,240,255,0.15)",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "24px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 0,
            background: "rgba(15,19,33,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            zIndex: 2,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 22, color: "#fff" }}>
              {project.title}
            </div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
              {project.desc}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    ...mono,
                    fontSize: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "3px 10px",
                    borderRadius: 9999,
                    color: "#00dbe9",
                    letterSpacing: "0.08em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: C.muted, fontSize: 20 }}
            >
              close
            </span>
          </button>
        </div>

        {/* tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 89,
            background: "rgba(15,19,33,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            zIndex: 2,
          }}
        >
          {(["gallery", "live"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "14px",
                border: "none",
                cursor: "pointer",
                background: tab === t ? "rgba(0,240,255,0.06)" : "transparent",
                color: tab === t ? C.cyanDim : C.muted,
                ...mono,
                fontSize: 12,
                letterSpacing: "0.1em",
                borderBottom:
                  tab === t ? `2px solid ${C.cyan}` : "2px solid transparent",
              }}
            >
              {t === "gallery" ? "SCREENSHOTS" : "LIVE_DEPLOY"}
              {t === "live" && (
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 14,
                    marginLeft: 6,
                    verticalAlign: "middle",
                  }}
                >
                  open_in_new
                </span>
              )}
            </button>
          ))}
        </div>

        {/* content */}
        <div style={{ padding: 24 }}>
          {tab === "gallery" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {project.gallery.map((src: string, i: number) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  onClick={() => setZoomed(src)}
                  style={{
                    width: "100%",
                    aspectRatio: "16/10",
                    objectFit: "cover",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.06)",
                    cursor: "zoom-in",
                    transition: "transform .25s ease, border-color .25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.borderColor = "rgba(0,240,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.06)";
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                aspectRatio: "16/9",
                background: "#000",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Remplace project.liveUrl par l'URL réellement déployée du projet */}
              <iframe
                src={project.liveUrl}
                title={project.title}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox — full-size screenshot view */}
      {zoomed && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setZoomed(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(null);
            }}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#fff", fontSize: 22 }}
            >
              close
            </span>
          </button>
          <img
            src={zoomed}
            alt="Zoomed screenshot"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: 12,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const hero3dRef = useRef<HTMLDivElement>(null);
  const [modalProject, setModalProject] = useState<any>(null);
  const [modalTab, setModalTab] = useState<"gallery" | "live">("gallery");
  const [showAllProjects, setShowAllProjects] = useState(false);

  // ── Scroll reveals ──────────────────────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document
      .querySelectorAll(".sr,.sr-left,.sr-right,.sr-scale")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [showAllProjects]);

  // ── Hero parallax ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${y * 0.28}px)`;
        heroRef.current.style.opacity = `${Math.max(0, 1 - y / 600)}`;
      }
      if (hero3dRef.current) {
        hero3dRef.current.style.transform = `translateY(${y * 0.12}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const navItems = [
    ["hero", "Project"],
    ["about", "Identity"],
    ["tech", "Stack"],
    ["work", "Archive"],
    ["contact", "Contact"],
  ] as const;

  const C = {
    bg: "#0a0d1c",
    surface: "#1b1f2e",
    cyan: "#00f0ff",
    cyanDim: "#7df4ff",
    text: "#dfe1f6",
    muted: "#b9cacb",
    card: "rgba(15,19,33,0.5)",
    border: "rgba(255,255,255,0.07)",
  };
  const card: React.CSSProperties = {
    background: C.card,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 32,
    position: "relative",
    overflow: "hidden",
  };
  const mono: React.CSSProperties = { fontFamily: "monospace" };

  // ── Tous les projets — ajoute / modifie librement les entrées ci-dessous ────
  const projects = [
    {
      title: "StockFlow",
      desc: "A repair and inventory management system that tracks office equipment such as printers and scanners throughout the maintenance lifecycle. It records device information, repair reports, technician interventions, and generates delivery notes (Bon de Sortie) when equipment is returned to the customer.",
      img: "/projects/stockflow/Capture.PNG", // Replace with your screenshot
      gallery: [
        "/projects/stockflow/Capture.PNG",
        "/projects/stockflow/Capture2.PNG",
        "/projects/stockflow/Capture3.PNG",
        "/projects/stockflow/Capture4.PNG",
      ],
      liveUrl: "",
      tags: ["electronJs", "SqlLite", "Tailwind CSS"],
    },
    /*  {
      title: "Crypt_Node",
      desc: "High-frequency distributed ledger management node.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCahP_pKKYNyGBj3t3lDAScMTFJsX8uCE6gun7Ig1NX0887Nf064ab7bne_AZTIWBDTX4DddRnFCkDQBYH_gLDqus5S3R3Cm0xgAbWnuDz-oAuPJ0yOqXfgKHp_0ra9Eyjn_kIZKeChZwAKGNEr7EbF5bu7hfjokgCNKyqLquYn-d7Sz5MJRJCVlZAqkWZ0jbom8YHobxjAmfSzsyF6S-MYG0NFz_cV92FRVtTiEkDJc1TzrZIoXNe3mhxe3l2VDV4YK_8R6JjmgbME",
      gallery: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCahP_pKKYNyGBj3t3lDAScMTFJsX8uCE6gun7Ig1NX0887Nf064ab7bne_AZTIWBDTX4DddRnFCkDQBYH_gLDqus5S3R3Cm0xgAbWnuDz-oAuPJ0yOqXfgKHp_0ra9Eyjn_kIZKeChZwAKGNEr7EbF5bu7hfjokgCNKyqLquYn-d7Sz5MJRJCVlZAqkWZ0jbom8YHobxjAmfSzsyF6S-MYG0NFz_cV92FRVtTiEkDJc1TzrZIoXNe3mhxe3l2VDV4YK_8R6JjmgbME",
      ],
      liveUrl: "https://your-crypt-node-demo.vercel.app",
      tags: ["NODE.JS", "RUST", "GRPC"],
    },
    {
      title: "Aegis_Auth",
      desc: "Modular authentication & permissions gateway for microservices.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuSpfqlA01CStR_CCi2RN8LQcOe63e0T_79nZyujl6Ah85B-oFpE0XIDcrBbey4f430IzXQyM24IoEypSMSHRHLOnvaB3myPXu2534m9MoUXrxrAbOEo6zDJpw9iWbTlS-dxyen2CUZWsiWRifbgHX9dlVKCcIKnqpbzh5Am9xsyBQT_665e21VabtG_QhHTQbL0NDDZIut4RVl_LG7VdAw3RNb4v7rAiyEY3y8-W58dUjqAmX7g_RRwsfpILMSe5DNwVCGz4-3WNO",
      gallery: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAuSpfqlA01CStR_CCi2RN8LQcOe63e0T_79nZyujl6Ah85B-oFpE0XIDcrBbey4f430IzXQyM24IoEypSMSHRHLOnvaB3myPXu2534m9MoUXrxrAbOEo6zDJpw9iWbTlS-dxyen2CUZWsiWRifbgHX9dlVKCcIKnqpbzh5Am9xsyBQT_665e21VabtG_QhHTQbL0NDDZIut4RVl_LG7VdAw3RNb4v7rAiyEY3y8-W58dUjqAmX7g_RRwsfpILMSe5DNwVCGz4-3WNO",
      ],
      liveUrl: "https://your-aegis-auth-demo.vercel.app",
      tags: ["NODE.JS", "JWT", "REDIS"],
    },
    {
      title: "Pulse_Analytics",
      desc: "Streaming metrics pipeline with live anomaly detection dashboards.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCahP_pKKYNyGBj3t3lDAScMTFJsX8uCE6gun7Ig1NX0887Nf064ab7bne_AZTIWBDTX4DddRnFCkDQBYH_gLDqus5S3R3Cm0xgAbWnuDz-oAuPJ0yOqXfgKHp_0ra9Eyjn_kIZKeChZwAKGNEr7EbF5bu7hfjokgCNKyqLquYn-d7Sz5MJRJCVlZAqkWZ0jbom8YHobxjAmfSzsyF6S-MYG0NFz_cV92FRVtTiEkDJc1TzrZIoXNe3mhxe3l2VDV4YK_8R6JjmgbME",
      gallery: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCahP_pKKYNyGBj3t3lDAScMTFJsX8uCE6gun7Ig1NX0887Nf064ab7bne_AZTIWBDTX4DddRnFCkDQBYH_gLDqus5S3R3Cm0xgAbWnuDz-oAuPJ0yOqXfgKHp_0ra9Eyjn_kIZKeChZwAKGNEr7EbF5bu7hfjokgCNKyqLquYn-d7Sz5MJRJCVlZAqkWZ0jbom8YHobxjAmfSzsyF6S-MYG0NFz_cV92FRVtTiEkDJc1TzrZIoXNe3mhxe3l2VDV4YK_8R6JjmgbME",
      ],
      liveUrl: "https://your-pulse-analytics-demo.vercel.app",
      tags: ["REACT", "D3.JS", "POSTGRESQL"],
    }, */
  ];

  const visibleProjects = showAllProjects ? projects : projects.slice(0, 2);

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        overflowX: "hidden",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      <style>{`
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>

      {/* Scanline */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 100,
          opacity: 0.12,
          background: "linear-gradient(rgba(0,0,0,0) 50%,rgba(0,0,0,0.15) 50%)",
          backgroundSize: "100% 4px",
        }}
      />
      <CursorGlow />
      <NeuralBg />

      {/* ── Header ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(10,13,28,0.75)",
        }}
      >
        <nav
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "14px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              ...mono,
              fontWeight: 700,
              fontSize: 14,
              color: C.cyanDim,
              background: "rgba(38,41,57,0.8)",
              padding: "6px 12px",
              borderRadius: 6,
              letterSpacing: "0.1em",
            }}
          >
            D.A_TERMINAL
          </span>
          <div
            style={{
              display: "flex",
              gap: 32,
              ...mono,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  background: "none",
                  border: "none",
                  color: id === "contact" ? C.cyanDim : `${C.muted}99`,
                  cursor: "pointer",
                  ...mono,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollTo("contact")}
            style={{
              background: C.cyan,
              color: "#003d3f",
              padding: "8px 20px",
              borderRadius: 9999,
              ...mono,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
            }}
          >
            Deploy
          </button>
        </nav>
      </header>

      <main style={{ position: "relative", zIndex: 10 }}>
        {/* ── Hero ── */}
        <section
          id="hero"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "96px 32px 48px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Hero text — parallax target */}
            <div
              ref={heroRef}
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >
              <span
                className="hero-word"
                style={
                  {
                    ...mono,
                    fontSize: 11,
                    color: C.cyanDim,
                    letterSpacing: "0.15em",
                    opacity: 0.7,
                    textTransform: "uppercase",
                    "--d": "0ms",
                  } as React.CSSProperties
                }
              >
                Established // 2026 // System_Initiated
              </span>
              <h1
                className="hero-word"
                style={
                  {
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                    color: "#fff",
                    margin: 0,
                    fontSize: "clamp(48px,7vw,88px)",
                    "--d": "120ms",
                  } as React.CSSProperties
                }
              >
                DOUAA
                <br />
                <span
                  style={{
                    WebkitTextStroke: "1px rgba(125,244,255,0.5)",
                    color: "transparent",
                  }}
                >
                  AGRAINE
                </span>
              </h1>
              <p
                className="hero-word"
                style={
                  {
                    fontSize: 17,
                    color: C.muted,
                    lineHeight: 1.7,
                    maxWidth: 480,
                    margin: 0,
                    "--d": "240ms",
                  } as React.CSSProperties
                }
              >
                Full Stack Software Engineer specializing in building immersive,
                high-performance digital ecosystems that bridge the gap between
                human and machine.
              </p>
              <div
                className="hero-word"
                style={
                  {
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    "--d": "360ms",
                  } as React.CSSProperties
                }
              >
                {[
                  ["code", "DESIGN"],
                  ["terminal", "DEVELOPMENT"],
                  ["token", "BRANDING"],
                ].map(([icon, label]) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(27,31,46,0.8)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "8px 16px",
                      borderRadius: 9999,
                      ...mono,
                      fontSize: 11,
                      color: C.cyanDim,
                      letterSpacing: "0.1em",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14 }}
                    >
                      {icon}
                    </span>
                    {label}
                  </span>
                ))}
              </div>
              <div
                className="hero-word"
                style={
                  {
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    marginTop: 8,
                    "--d": "480ms",
                  } as React.CSSProperties
                }
              >
                <button
                  onClick={() => scrollTo("work")}
                  style={{
                    background: C.cyan,
                    color: "#003d3f",
                    padding: "15px 32px",
                    borderRadius: 9999,
                    ...mono,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  SCROLL_TO_EXPLORE ↓
                </button>
                <span
                  style={{
                    ...mono,
                    fontSize: 11,
                    color: `${C.muted}50`,
                    letterSpacing: "0.1em",
                  }}
                >
                  Algiers, DZ
                </span>
              </div>
            </div>

            {/* Hero 3D — subtle parallax */}
            <div ref={hero3dRef} style={{ position: "relative", height: 500 }}>
              <Hero3D />
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section
          id="about"
          style={{ padding: "96px 32px", maxWidth: 1280, margin: "0 auto" }}
        >
          {/* Section label */}
          <div
            className="sr"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: 12,
                color: C.cyanDim,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              01. Log_Identity
            </span>
            <div
              style={{
                height: 1,
                flex: 1,
                background:
                  "linear-gradient(to right,rgba(0,240,255,0.3),transparent)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Panneau identité — remplace la photo, glisse depuis la gauche */}
            <div className="sr-left">
              <IdentityPanel C={C} card={card} mono={mono} />
            </div>

            {/* Text — slides in from right */}
            <div
              className="sr-right"
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 34,
                  color: "#fff",
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                Engineering Digital Experiences Through Technical Rigor.
              </h2>
              <p
                style={{
                  color: C.muted,
                  fontSize: 17,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                My approach centers on &quot;Cinematic Engineering&quot;—the
                intersection of flawless code and high-end aesthetic execution.
                I focus on building scalable systems that don&apos;t just work,
                but inspire.
              </p>
              <p
                style={{
                  color: C.muted,
                  fontSize: 17,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                From complex microservices architectures to high-fidelity
                frontend interfaces, I treat every project as a unique piece of
                digital architecture.
              </p>
              {/* Stats — stagger */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginTop: 8,
                }}
              >
                {[
                  ["04+", "Projects_Deployed", 0],
                  ["02", "Years_Experience", 120],
                ].map(([v, l, delay]) => (
                  <div
                    key={String(l)}
                    className="sr-scale"
                    style={{ ...card, ...d(Number(delay)) }}
                  >
                    <div
                      style={{
                        fontSize: 40,
                        fontWeight: 900,
                        color: C.cyanDim,
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        ...mono,
                        fontSize: 10,
                        color: `${C.muted}80`,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginTop: 6,
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section
          id="experience"
          style={{ padding: "96px 32px", maxWidth: 1280, margin: "0 auto" }}
        >
          <div
            className="sr"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: 12,
                color: C.cyanDim,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              02. Career_Stream
            </span>
            <div
              style={{
                height: 1,
                flex: 1,
                background:
                  "linear-gradient(to right,rgba(0,240,255,0.3),transparent)",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                period: "2024 — PRESENT",
                title: "Full stack developer",
                desc: "Leading the development of a next-generation distributed trading platform. Focused on low-latency data processing and high-end visualization tools.",
                tags: ["react", "node", "mysql"],
                delay: 0,
              },
            ].map((exp) => (
              <div
                key={exp.title}
                className="sr"
                style={{
                  ...card,
                  ...d(exp.delay),
                  display: "grid",
                  gridTemplateColumns: "200px 1fr auto",
                  gap: 32,
                  alignItems: "start",
                  borderRadius: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      ...mono,
                      fontSize: 11,
                      color: C.cyanDim,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {exp.period}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 19,
                      color: "#fff",
                      marginTop: 8,
                    }}
                  >
                    {exp.title}
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      color: C.muted,
                      fontSize: 15,
                      lineHeight: 1.7,
                      margin: "0 0 12px",
                    }}
                  >
                    {exp.desc}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          ...mono,
                          fontSize: 10,
                          border: "1px solid rgba(255,255,255,0.12)",
                          padding: "3px 10px",
                          borderRadius: 4,
                          color: `${C.muted}70`,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stack ── */}
        <section
          id="tech"
          style={{ padding: "96px 32px", maxWidth: 1280, margin: "0 auto" }}
        >
          <div
            className="sr"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: 12,
                color: C.cyanDim,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              03. Stack_Manifest
            </span>
            <div
              style={{
                height: 1,
                flex: 1,
                background:
                  "linear-gradient(to right,rgba(0,240,255,0.3),transparent)",
              }}
            />
          </div>

          <div className="sr-scale">
            <TechGrid C={C} card={card} mono={mono} />
          </div>
        </section>

        {/* ── Work ── */}
        <section
          id="work"
          style={{ padding: "96px 32px", maxWidth: 1280, margin: "0 auto" }}
        >
          <div
            className="sr"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: 12,
                color: C.cyanDim,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              04. Archive_Selected
            </span>
            <div
              style={{
                height: 1,
                flex: 1,
                background:
                  "linear-gradient(to right,rgba(0,240,255,0.3),transparent)",
              }}
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
          >
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                onClick={() => {
                  setModalProject(project);
                  setModalTab("gallery");
                }}
                C={C}
                card={card}
                mono={mono}
              />
            ))}
          </div>

          {projects.length > 2 && (
            <div style={{ textAlign: "center", marginTop: 56 }}>
              <button
                onClick={() => setShowAllProjects((v) => !v)}
                style={{
                  ...mono,
                  fontSize: 11,
                  color: C.muted,
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "14px 40px",
                  borderRadius: 9999,
                  background: "none",
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {showAllProjects
                  ? "← SHOW_LESS"
                  : `EXPLORE_FULL_ARCHIVE (${projects.length}) →`}
              </button>
            </div>
          )}
        </section>

        {/* ── Contact ── */}
        <section
          id="contact"
          style={{ padding: "96px 32px", maxWidth: 1280, margin: "0 auto" }}
        >
          <div
            className="sr"
            style={{
              ...card,
              borderRadius: 40,
              padding: "64px 80px",
              border: "1px solid rgba(0,240,255,0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 400,
                height: 400,
                background: "rgba(0,240,255,0.04)",
                filter: "blur(120px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 48,
              }}
            >
              <span
                style={{
                  ...mono,
                  fontSize: 12,
                  color: C.cyanDim,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                05. Connect_Sys
              </span>
              <div
                style={{
                  height: 1,
                  flex: 1,
                  background:
                    "linear-gradient(to right,rgba(0,240,255,0.3),transparent)",
                }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: 28 }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 42,
                    color: "#fff",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Let&apos;s Build the
                  <br />
                  Future Together.
                </h2>
                <p
                  style={{
                    fontSize: 17,
                    color: C.muted,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  Currently open to senior engineering roles, architectural
                  consulting, and high-impact collaborations.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {[
                    [
                      "mail",
                      "douag892@gmail.com",
                      "mailto:douag892@gmail.com",
                    ],
                    ["alternate_email", "@douaa_agraine", "#"],
                  ].map(([icon, text, href]) => (
                    <a
                      key={text}
                      href={href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        color: C.cyanDim,
                        ...mono,
                        fontSize: 13,
                        textDecoration: "none",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          padding: 10,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontSize: 20,
                        }}
                      >
                        {icon}
                      </span>
                      {text}
                    </a>
                  ))}
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "24px 32px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              ...mono,
              fontSize: 11,
              color: `${C.muted}30`,
              letterSpacing: "0.1em",
            }}
          >
            ©2026_SYSTEM_OPERATIONAL // ALGIERS_BRANCH
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["GitHub", "LinkedIn", "Documentation", "Status"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  ...mono,
                  fontSize: 11,
                  color: `${C.muted}30`,
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Project modal */}
      <ProjectModal
        project={modalProject}
        tab={modalTab}
        setTab={setModalTab}
        onClose={() => setModalProject(null)}
        C={C}
        card={card}
        mono={mono}
      />
    </div>
  );
}
