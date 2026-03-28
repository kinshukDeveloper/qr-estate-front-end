'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Antigravity Particle Field ─────────────────────────────────────────────
   800 particles arranged in a QR-code constellation.
   Mouse cursor creates a repulsion force field.
   Particles spring back to formation when cursor leaves.
   ─────────────────────────────────────────────────────────────────────────── */

// Reduced QR pattern (8x8 simplified for 3D density)
const QR_PATTERN: [number, number][] = [
  // Top-left finder
  [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  [1,0],[1,6],[2,0],[2,2],[2,3],[2,4],[2,6],
  [3,0],[3,2],[3,3],[3,4],[3,6],[4,0],[4,2],
  [4,3],[4,4],[4,6],[5,0],[5,6],[6,0],[6,1],
  [6,2],[6,3],[6,4],[6,5],[6,6],
  // Top-right finder
  [0,14],[0,15],[0,16],[0,17],[0,18],[0,19],[0,20],
  [1,14],[1,20],[2,14],[2,16],[2,17],[2,18],[2,20],
  [3,14],[3,16],[3,17],[3,18],[3,20],[4,14],[4,16],
  [4,17],[4,18],[4,20],[5,14],[5,20],[6,14],[6,15],
  [6,16],[6,17],[6,18],[6,19],[6,20],
  // Bottom-left finder
  [14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],
  [15,0],[15,6],[16,0],[16,2],[16,3],[16,4],[16,6],
  [17,0],[17,2],[17,3],[17,4],[17,6],[18,0],[18,2],
  [18,3],[18,4],[18,6],[19,0],[19,6],[20,0],[20,1],
  [20,2],[20,3],[20,4],[20,5],[20,6],
  // Data modules
  [8,2],[8,4],[8,7],[8,9],[8,11],[8,14],[8,17],
  [9,1],[9,3],[9,6],[9,8],[9,10],[9,13],[9,16],
  [10,2],[10,5],[10,7],[10,9],[10,12],[10,15],[10,18],
  [11,1],[11,4],[11,6],[11,8],[11,11],[11,14],[11,17],
  [12,3],[12,5],[12,8],[12,10],[12,13],[12,16],[12,19],
];

// Mouse position in normalized -1..1 space
const mousePos = { x: 0, y: 0, active: false };

function trackMouse() {
  const handler = (e: MouseEvent) => {
    mousePos.x = (e.clientX / window.innerWidth)  * 2 - 1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mousePos.active = true;
  };
  const leave = () => { mousePos.active = false; };
  window.addEventListener('mousemove', handler);
  window.addEventListener('mouseleave', leave);
  return () => {
    window.removeEventListener('mousemove', handler);
    window.removeEventListener('mouseleave', leave);
  };
}

// ── Main particle system ───────────────────────────────────────────────────────
function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const clock = useRef(0);

  // Build particle data: target positions from QR pattern + random extras
  const data = useMemo(() => {
    const SCALE = 0.22;
    const OFFSET = 10; // center the 20x20 grid

    // QR particles
    const qrParticles = QR_PATTERN.map(([row, col], i) => ({
      tx: (col - OFFSET) * SCALE,
      ty: -(row - OFFSET) * SCALE,
      tz: 0,
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 15,
      vx: 0, vy: 0, vz: 0,
      phase: Math.random() * Math.PI * 2,
      size: 0.06 + Math.random() * 0.04,
      isQR: true,
    }));

    // Extra ambient particles (smaller, dimmer)
    const extras = Array.from({ length: 200 }, (_, i) => ({
      tx: (Math.random() - 0.5) * 8,
      ty: (Math.random() - 0.5) * 8,
      tz: (Math.random() - 0.5) * 4,
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10,
      vx: 0, vy: 0, vz: 0,
      phase: Math.random() * Math.PI * 2,
      size: 0.02 + Math.random() * 0.025,
      isQR: false,
    }));

    return [...qrParticles, ...extras];
  }, []);

  const totalCount = data.length;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Colour arrays
  const colors = useMemo(() => {
    const c = new Float32Array(totalCount * 3);
    const gold  = new THREE.Color('#E8B84B');
    const teal  = new THREE.Color('#18D4C8');
    const white = new THREE.Color('#ffffff');
    data.forEach((p, i) => {
      const col = p.isQR
        ? (Math.random() < 0.7 ? teal : gold)
        : white;
      c[i * 3 + 0] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    });
    return c;
  }, [data, totalCount]);

  useEffect(() => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry as THREE.BufferGeometry;
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [colors]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    clock.current += delta;
    const t = clock.current;

    // Project mouse to world space at z=0 plane
    const mx = mousePos.x * 5.5;
    const my = mousePos.y * 4;
    const repulseRadius = 1.8;
    const repulseStrength = mousePos.active ? 3.5 : 0;

    for (let i = 0; i < totalCount; i++) {
      const p = data[i];

      // Spring toward target
      const springK = p.isQR ? 4.5 : 2.0;
      const damping  = p.isQR ? 5.0 : 4.0;

      const floatX = Math.sin(t * 0.4 + p.phase) * (p.isQR ? 0.015 : 0.04);
      const floatY = Math.cos(t * 0.35 + p.phase + 1) * (p.isQR ? 0.015 : 0.04);

      const ax = springK * (p.tx + floatX - p.x) - damping * p.vx;
      const ay = springK * (p.ty + floatY - p.y) - damping * p.vy;
      const az = springK * (p.tz - p.z) - damping * p.vz;

      // Mouse repulsion
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repulseRadius && repulseStrength > 0) {
        const force = (repulseRadius - dist) / repulseRadius;
        p.vx += (dx / dist) * force * repulseStrength * delta * 60;
        p.vy += (dy / dist) * force * repulseStrength * delta * 60;
      }

      p.vx += ax * delta;
      p.vy += ay * delta;
      p.vz += az * delta;
      p.x  += p.vx * delta;
      p.y  += p.vy * delta;
      p.z  += p.vz * delta;

      dummy.position.set(p.x, p.y, p.z);
      const s = p.size * (1 + Math.sin(t * 2 + p.phase) * 0.15);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Slow group drift
    meshRef.current.rotation.y = Math.sin(t * 0.05) * 0.08;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, totalCount]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        vertexColors
        emissive="#18D4C8"
        emissiveIntensity={0.7}
        roughness={0.2}
        metalness={0.6}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

// ── Floating orb ──────────────────────────────────────────────────────────────
function GoldOrb() {
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh position={[3.2, -2, -3]} scale={0.35}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#E8B84B"
          emissive="#E8B84B"
          emissiveIntensity={0.4}
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// ── Connection lines ───────────────────────────────────────────────────────────
function GridLines() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    const GRID = 6;
    const STEP = 1.5;
    // Horizontal lines
    for (let i = -GRID; i <= GRID; i++) {
      pts.push(-GRID * STEP, i * STEP * 0.6, -8, GRID * STEP, i * STEP * 0.6, -8);
    }
    // Vertical lines
    for (let i = -GRID; i <= GRID; i++) {
      pts.push(i * STEP, -GRID * STEP * 0.6, -8, i * STEP, GRID * STEP * 0.6, -8);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock: c }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.04 + Math.sin(c.getElapsedTime() * 0.5) * 0.02;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#18D4C8" transparent opacity={0.05} />
    </lineSegments>
  );
}

// ── Scene wrapper ─────────────────────────────────────────────────────────────
export default function HeroSceneV3() {
  useEffect(() => trackMouse(), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]}   color="#E8B84B" intensity={2} />
      <pointLight position={[-5, -5, 3]} color="#18D4C8" intensity={1.5} />
      <pointLight position={[0, 0, 6]}   color="#ffffff"  intensity={0.5} />

      {/* Particles */}
      <ParticleField />

      {/* Decoration */}
      <GoldOrb />
      <GridLines />
      <Stars
        radius={30}
        depth={30}
        count={600}
        factor={1.5}
        fade
        speed={0.2}
        
      />
    </Canvas>
  );
}
