'use client';

import { useEffect, useRef } from 'react';
import type { Group } from 'three';

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;

    async function init() {
      const THREE = await import('three');

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        container!.clientWidth / container!.clientHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container!.clientWidth, container!.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container!.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xdbfcff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.2,
        thickness: 1.0,
        ior: 1.5,
      });

      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.7,
      });

      const cubes: { mesh: Group; speed: number }[] = [];

      for (let i = 0; i < 12; i++) {
        const cubeGroup = new THREE.Group();
        const outer = new THREE.Mesh(cubeGeometry, glassMaterial);
        const inner = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), glowMaterial);

        cubeGroup.add(outer);
        cubeGroup.add(inner);

        cubeGroup.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        );
        cubeGroup.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        group.add(cubeGroup);
        cubes.push({ mesh: cubeGroup, speed: 0.002 + Math.random() * 0.005 });
      }

      const pLight = new THREE.PointLight(0x00f0ff, 2.5, 15);
      pLight.position.set(5, 5, 5);
      scene.add(pLight);
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));

      camera.position.z = 10;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      function animate() {
        rafId = requestAnimationFrame(animate);
        group.rotation.y += (mouseX - group.rotation.y) * 0.05;
        group.rotation.x += (mouseY - group.rotation.x) * 0.05;
        cubes.forEach((c) => {
          c.mesh.rotation.z += c.speed;
          c.mesh.position.y += Math.sin(Date.now() * 0.001 + c.mesh.position.x) * 0.003;
        });
        renderer.render(scene, camera);
      }
      animate();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        if (container && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    const cleanup = init();
    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 right-0 w-full h-full"
      style={{ zIndex: 3 }}
    />
  );
}
