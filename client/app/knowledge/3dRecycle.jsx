"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";

// Individual scrap cube
function Scrap({ position, color }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={hovered ? 1.2 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color={hovered ? "#22c55e" : color} />
    </mesh>
  );
}

// Center recycling core
function RecyclingCore() {
  const ref = useRef(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[1, 0.15, 16, 100]} />
      <meshStandardMaterial color="#16a34a" />
    </mesh>
  );
}

export default function RecyclingScene() {
  return (
    <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-green-900 via-black to-green-800">
      <Canvas camera={{ position: [3, 2, 4] }}>
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Center core */}
        <RecyclingCore />

        {/* Scrap elements */}
        <Scrap position={[2, 0, 0]} color="#9ca3af" /> {/* metal */}
        <Scrap position={[-2, 0, 0]} color="#60a5fa" /> {/* plastic */}
        <Scrap position={[0, 0, 2]} color="#facc15" /> {/* paper */}
        <Scrap position={[0, 0, -2]} color="#f97316" /> {/* e-waste */}

        {/* Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}