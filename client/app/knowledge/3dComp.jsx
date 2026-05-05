"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

// Simple rotating drone-like object
function Drone() {
  const meshRef = useRef(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 0.3, 1]} />
      <meshStandardMaterial color="#4f46e5" />
    </mesh>
  );
}

export default function UAVScene() {
  return (
    <div className="w-full h-[300px] rounded-2xl overflow-hidden shadow-md bg-black">
      <Canvas camera={{ position: [2, 2, 3] }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* 3D Object */}
        <Drone />

        {/* Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}