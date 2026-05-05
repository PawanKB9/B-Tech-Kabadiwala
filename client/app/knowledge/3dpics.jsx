"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

/* 🌳 Tree */
function Tree({ position }) {
  const trunkRef = useRef(null);

  useFrame(() => {
    if (trunkRef.current) {
      trunkRef.current.rotation.y += 0.002; // subtle motion
    }
  });

  return (
    <group position={position}>
      {/* trunk */}
      <mesh ref={trunkRef} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#7c3f00" />
      </mesh>

      {/* leaves */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
    </group>
  );
}

/* 🚛 Simple Recycling Truck */
function Truck({ position }) {
  const ref = useRef(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += 0.01;
      if (ref.current.position.x > 2) {
        ref.current.position.x = -2; // loop motion
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.5]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* cabin */}
      <mesh position={[0.6, 0.2, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      {/* wheels */}
      <mesh position={[-0.4, -0.3, 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.4, -0.3, 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

/* ♻️ Recycling Symbol (ring rotation) */
function RecyclingSymbol() {
  const ref = useRef(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.5, 0]}>
      <torusGeometry args={[1, 0.15, 16, 100]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
}

/* 🌍 Ground */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#14532d" />
    </mesh>
  );
}

/* 🌤️ Main Scene */
export default function RecyclingNature() {
  return (
    <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-green-200 via-green-100 to-blue-200">
      <Canvas camera={{ position: [4, 2, 5] }}>
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Scene Elements */}
        <Ground />
        <RecyclingSymbol />

        {/* Trees */}
        <Tree position={[-2, 0, -1]} />
        <Tree position={[2, 0, -1]} />

        {/* Moving truck */}
        <Truck position={[-2, -0.5, 1]} />

        {/* Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}