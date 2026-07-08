'use client';

import { useEffect, useRef } from 'react';

export default function NeuralShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', syncSize);
    syncSize();

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        vec2 centered = (uv - 0.5) * 2.0;
        centered.x *= u_resolution.x / u_resolution.y;

        vec3 color = vec3(0.04, 0.05, 0.1);

        float line = 0.0;
        for(float i=1.0; i<4.0; i++) {
          float t = u_time * (0.05 + i*0.02);
          float x_off = sin(centered.y * 2.0 + t) * 0.5;
          float dist = abs(centered.x - x_off - (i-2.0)*0.8);
          float intensity = smoothstep(0.02, 0.0, dist);
          line += intensity * (0.5 + 0.5 * sin(t + i));
        }

        vec3 accent = vec3(0.0, 0.86, 1.0) * line * 0.4;
        color += accent;

        float n = random(uv + u_time * 0.005);
        if(n > 0.99) color += vec3(0.0, 1.0, 1.0) * 0.3;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    let rafId: number;

    function render(t: number) {
      if (!canvas) return;
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform1f(uTime, t * 0.001);
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', syncSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  );
}
