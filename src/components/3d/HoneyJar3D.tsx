'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export function HoneyJar3D({ flavor }: { flavor: 'classic' | 'dark' }) {
  const { scene } = useGLTF('/honey_bottle.glb');
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Modify materials based on flavor (optional, if the glb uses standard materials we can tweak the honey liquid color)
  // Assuming the honey liquid has a specific material name like 'Liquid' or 'Honey'
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        
        // Example: if there's a material named 'Liquid' or 'Honey', change its color slightly based on flavor
        if (mat.name.toLowerCase().includes('liquid') || mat.name.toLowerCase().includes('honey')) {
          const targetColor = flavor === 'dark' ? new THREE.Color('#451a03') : new THREE.Color('#d97706');
          gsap.to(mat.color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 1.5,
            ease: 'power2.inOut'
          });
        }
      }
    });
  }, [flavor, scene]);

  useFrame((state, delta) => {
    if (group.current) {
      // Smoothly rotate the jar towards the mouse cursor
      const targetRotationX = mouse.current.y * 0.2;
      const targetRotationY = mouse.current.x * 0.5;
      
      group.current.rotation.x += (targetRotationX - group.current.rotation.x) * 0.05;
      group.current.rotation.y += (targetRotationY - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
        <group ref={group}>
          <primitive object={scene} scale={2} position={[0, -1, 0]} />
        </group>
      </Float>
      
      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
    </>
  );
}

useGLTF.preload('/honey_bottle.glb');
