import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { Model_three_D } from "./Model_three_D";

/* ---------- Responsive Model Wrapper ---------- */
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const FitModel = ({ children, isMobile }) => {
  const ref = useRef();

  useLayoutEffect(() => {
    if (!ref.current) return;

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = box.getSize(new THREE.Vector3());

    const targetSize = isMobile ? 1.4 : 0.5;

    const maxAxis = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxAxis;

    ref.current.scale.setScalar(scale);
  }, [isMobile]);

  return <group ref={ref}>{children}</group>;
};

/* ---------- Main Scene ---------- */
const HeroExperience = () => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Positioning (layout-based, not size-based)
  const positionY = isMobile ? -1.2 : isTablet ? -1.0 : -0.7;
  const positionX = isMobile ? 0 : 0.3;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: [0, 1, isMobile ? 18 : 15],
        fov: isMobile ? 45 : 35,
      }}
      shadows
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 5, 10]} intensity={0.5} />

      <Environment preset="city" />

      <OrbitControls
        enablePan={false}
        enableZoom={!isMobile}
        enableRotate={!isMobile}
        maxDistance={20}
        minDistance={6}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Model */}
      <group position={[positionX, positionY, 0]}>
        <FitModel isMobile={isMobile}>
          <Center>
            <Model_three_D />
          </Center>
        </FitModel>
      </group>
    </Canvas>
  );
};

export default HeroExperience;
