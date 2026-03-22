'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { QR_FILLED } from './QRVisual';

// ── QR cubes — one per filled module ──────────────────────────────────────────
function QRCubeField() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const clock = useRef(0);

  // Target positions from the QR matrix (mapped to 3D coords)
  const targets = useMemo(() => {
    return QR_FILLED.map(([row, col]) => ({
      x: (col - 5.5) * 0.28,
      y: -(row - 5.5) * 0.28,
      z: Math.sin(row * 1.3 + col * 0.9) * 0.3,
    }));
  }, []);

  // Current positions (start scattered)
  const positions = useRef<{ x: number; y: number; z: number; phase: number }[]>(
    targets.map((t) => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 10,
      phase: Math.random() * Math.PI * 2,
    }))
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const totalCount = targets.length;

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;
    clock.current += delta;
    const t = clock.current;

    // Slow group rotation
    groupRef.current.rotation.y = t * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.12;

    for (let i = 0; i < totalCount; i++) {
      const cur = positions.current[i];
      const tgt = targets[i];
      const lerpSpeed = Math.min(1, 0.018 + i * 0.0001);

      cur.x += (tgt.x - cur.x) * lerpSpeed;
      cur.y += (tgt.y - cur.y) * lerpSpeed;
      cur.z += (tgt.z - cur.z) * lerpSpeed;

      // Gentle float after settling
      const settled = Math.abs(cur.x - tgt.x) < 0.1;
      const floatY = settled ? Math.sin(t * 0.5 + cur.phase) * 0.04 : 0;
      const floatZ = settled ? Math.cos(t * 0.4 + cur.phase) * 0.02 : 0;

      dummy.position.set(cur.x, cur.y + floatY, cur.z + floatZ);
      dummy.rotation.set(
        Math.sin(t * 0.2 + cur.phase) * 0.1,
        Math.cos(t * 0.15 + cur.phase) * 0.1,
        0
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, totalCount]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.06]} />
        <meshStandardMaterial
          color="#00D4C8"
          emissive="#00D4C8"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.2}
        />
      </instancedMesh>
    </group>
  );
}

// ── Ambient particle dust ──────────────────────────────────────────────────────
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 600;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#00D4C8" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

// ── Camera drift ──────────────────────────────────────────────────────────────
function CameraDrift() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.08) * 0.6;
    camera.position.y = Math.cos(t * 0.06) * 0.4;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Canvas export ──────────────────────────────────────────────────────────────
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#00D4C8" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#60A5FA" />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#00D4C8" distance={8} />

      <CameraDrift />
      <QRCubeField />
      <Particles />

      {/* Distant star field */}
      <Stars radius={60} depth={40} count={800} factor={2} saturation={0} fade speed={0.5} />
    </Canvas>
  );
}
