'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Honey Jar Model Component
 * Procedurally generates a realistic cylinder jar, honey liquid, and lid
 * with advanced physical materials mimicking real-world light refraction.
 */
function HoneyJar() {
  const jarRef = useRef<THREE.Group>(null);

  // Subtle automatic idle rotation to showcase the product beautifully
  useFrame((state) => {
    if (jarRef.current) {
      jarRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={jarRef}>
      {/* 1. THE HONEY (Inside Liquid Core) */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 1.4, 32]} />
        <meshPhysicalMaterial
          color="#d47a00"
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.55} // Gives honey its dense, translucent organic look
          thickness={0.6}     // Depth thickness for inner light scattering
        />
      </mesh>

      {/* 2. THE GLASS JAR (Outer Layer) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.6, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          transmission={0.95} // High transmission creates clean transparent glass
          opacity={1}
          roughness={0.02}
          metalness={0}
          ior={1.52}          // Index of Refraction (standard value for real glass)
          thickness={0.15}    // Simulated glass wall thickness
          specularIntensity={1.0}
        />
      </mesh>

      {/* 3. THE JAR LID */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.15, 32]} />
        <meshStandardMaterial
          color="#151515"     // Sleek black lid matching the brand profile
          roughness={0.25}
          metalness={0.85}    // High metalness for crisp, realistic studio reflections
        />
      </mesh>
    </group>
  );
}

/**
 * Main Self-Contained 3D Container Component
 * Exported to be dropped right into any UI page layout.
 */
export default function HoneyJar3DScene() {
  return (
    <div 
      className="w-full h-[500px] min-h-[400px] relative bg-transparent"
    >
      <Canvas 
        camera={{ position: [0, 2, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }} // Ensures crisp edges and clear backgrounds
      >
        {/* Natural Studio Light Framework */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-5, 4, -3]} intensity={0.4} />
        <pointLight position={[0, 5, 2]} intensity={0.8} />

        {/* Automatic layout centering and smooth dynamic ambient shadows */}
        <Stage environment="studio" intensity={0.4} shadows={{ type: "contact", opacity: 0.5, blur: 2.5 }}>
          <Center>
            <HoneyJar />
          </Center>
        </Stage>

        {/* Dynamic touch and mouse gesture controls */}
        <OrbitControls 
          enableZoom={true} 
          minDistance={1.8} 
          maxDistance={6}
          enablePan={false} // Keeps camera fixed focus on the product
          makeDefault 
        />
      </Canvas>
    </div>
  );
}
