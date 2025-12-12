import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { useGLTF } from "@react-three/drei";

const WorkstationModel = (props) => {
  const ref = useRef();
  const { scene } = useGLTF("../../../models/hero.glb");

  // Subtle rotation animation
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015; // slower rotation
    }
  });

  return <primitive ref={ref} object={scene} {...props} />;
};

const HeroExperience = () => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Responsive scale & position
  const scale = isMobile ? 0.004 : isTablet ? 0.006 : 0.008;
  const positionY = isMobile ? -0.5 : isTablet ? -0.8 : -0.7;

  return (
    <Canvas
      camera={{
        position: [0, 1, 12], // camera pulled back a bit
        fov: isMobile ? 40 : 35,
      }}
      shadows
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 5, 10]} intensity={0.5} />

      {/* Optional environment for reflections */}
      <Environment preset="city" />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Model */}
      <group scale={scale} position={[0.3, positionY, 0]}>
        <WorkstationModel />
      </group>
    </Canvas>
  );
};

export default HeroExperience;
