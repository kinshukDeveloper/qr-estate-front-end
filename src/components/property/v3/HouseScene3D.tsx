'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls, Environment, Float,
  MeshDistortMaterial, RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';

interface HouseProps {
  bedrooms:     number;
  floors:       number;
  propertyType: string;
  color?:       string;
}

/* ── Procedural House Model ───────────────────────────────────────────────────
   Generates a 3D architectural model from listing data.
   No GLB needed — all geometry is procedural Three.js.
   ─────────────────────────────────────────────────────────────────────────── */
function ProceduralHouse({ bedrooms, floors, propertyType, color = '#E8B84B' }: HouseProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Derive dimensions from listing data
  const W = 2 + Math.min(bedrooms, 4) * 0.3;   // width scales with bedrooms
  const H = 0.9 * Math.max(floors, 1);          // height scales with floors
  const D = 1.8;

  const isApartment = propertyType === 'apartment' || propertyType === 'pg';
  const isVilla     = propertyType === 'villa';

  const wallColor   = '#F0ECE4';
  const roofColor   = color;
  const windowColor = '#A8D4F0';
  const accentColor = color;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.08 + t * 0.04;
  });

  // Window grid for apartment
  const windows = useMemo(() => {
    const arr: [number, number, number][] = [];
    const cols = Math.max(2, bedrooms);
    const rows = Math.max(1, floors);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push([
          (c - (cols - 1) / 2) * (W / cols),
          0.1 + r * (H / rows) - H / 2 + H / rows / 2,
          D / 2 + 0.02,
        ]);
      }
    }
    return arr;
  }, [bedrooms, floors, W, H, D]);

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Foundation / base slab */}
      <mesh position={[0, -H / 2 - 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[W + 0.4, 0.12, D + 0.4]} />
        <meshStandardMaterial color="#B0A898" roughness={0.9} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={wallColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Roof — flat for apartment, pitched for house/villa */}
      {isApartment ? (
        <>
          {/* Flat parapet roof */}
          <mesh position={[0, H / 2 + 0.06, 0]} castShadow>
            <boxGeometry args={[W + 0.1, 0.12, D + 0.1]} />
            <meshStandardMaterial color={roofColor} roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Rooftop AC units */}
          {[-.5, .5].map((x, i) => (
            <mesh key={i} position={[x * W * 0.4, H / 2 + 0.2, 0]} castShadow>
              <boxGeometry args={[0.35, 0.2, 0.28]} />
              <meshStandardMaterial color="#CCC" roughness={0.7} />
            </mesh>
          ))}
        </>
      ) : (
        /* Pitched roof */
        <mesh position={[0, H / 2 + 0.36, 0]} castShadow>
          <coneGeometry args={[Math.max(W, D) * 0.72, 0.72, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.4} metalness={0.5} />
        </mesh>
      )}

      {/* Windows */}
      {windows.map(([wx, wy, wz], i) => (
        <group key={i} position={[wx, wy, wz]}>
          {/* Frame */}
          <mesh>
            <boxGeometry args={[0.3, 0.38, 0.03]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Glass */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.22, 0.28, 0.01]} />
            <meshStandardMaterial
              color={windowColor}
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.7}
              envMapIntensity={2}
            />
          </mesh>
          {/* Window glow (emissive warm light inside) */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.2, 0.26, 0.01]} />
            <meshStandardMaterial
              color="#FFD080"
              emissive="#FFD080"
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Front door */}
      <group position={[0, -H / 2 + 0.28, D / 2 + 0.02]}>
        <mesh>
          <boxGeometry args={[0.42, 0.56, 0.03]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.16, 0, 0.03]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Balcony (for apartments with 2+ floors) */}
      {isApartment && floors >= 2 && (
        <>
          <mesh position={[0, 0, D / 2 + 0.12]} castShadow>
            <boxGeometry args={[W * 0.6, 0.08, 0.24]} />
            <meshStandardMaterial color="#DDD8D0" roughness={0.7} />
          </mesh>
          {/* Railings */}
          {[-1, 0, 1].map((rx, i) => (
            <mesh key={i} position={[rx * W * 0.2, 0.1, D / 2 + 0.22]}>
              <boxGeometry args={[0.04, 0.28, 0.04]} />
              <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.6} />
            </mesh>
          ))}
        </>
      )}

      {/* Villa: garage */}
      {isVilla && (
        <mesh position={[W / 2 + 0.3, -H / 4, 0]} castShadow>
          <boxGeometry args={[0.6, H / 2, D * 0.6]} />
          <meshStandardMaterial color={wallColor} roughness={0.7} />
        </mesh>
      )}

      {/* Ground plane */}
      <mesh position={[0, -H / 2 - 0.13, 0]} receiveShadow>
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial color="#2A4A2A" roughness={0.95} />
      </mesh>

      {/* Trees */}
      {[[-1.8, 0.4], [1.8, -0.2]].map(([tx, tz], i) => (
        <group key={i} position={[tx as number, -H / 2, tz as number]}>
          {/* Trunk */}
          <mesh>
            <cylinderGeometry args={[0.07, 0.09, 0.5, 8]} />
            <meshStandardMaterial color="#5A3A1A" roughness={0.9} />
          </mesh>
          {/* Foliage — stacked cones */}
          {[0.5, 0.35, 0.2].map((py, j) => (
            <mesh key={j} position={[0, 0.4 + j * 0.22, 0]}>
              <coneGeometry args={[0.4 - j * 0.08, 0.38, 7]} />
              <meshStandardMaterial color={`hsl(${120 + j * 10}, 40%, ${25 + j * 5}%)`} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ── Floating data labels ──────────────────────────────────────────────────── */
function DataPoint({ position, label, value, color }: {
  position: [number, number, number];
  label: string; value: string; color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.06;
  });
  return (
    <group ref={ref} position={position}>
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4}>
        {/* Connection line */}
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
        {/* Dot */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

/* ── Particle dust ─────────────────────────────────────────────────────────── */
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const { positions, count } = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return { positions, count };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#E8B84B" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ── Main export ──────────────────────────────────────────────────────────── */
export default function HouseScene3D({
  bedrooms = 2, floors = 5, propertyType = 'apartment',
  price, sqft, color = '#E8B84B',
}: {
  bedrooms?: number; floors?: number; propertyType?: string;
  price?: number; sqft?: number; color?: string;
}) {
  return (
    <Canvas
      camera={{ position: [3.5, 2, 5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      shadows
    >
      {/* Lights */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[8, 12, 6]} intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        color="#FFF5E0"
      />
      <pointLight position={[-4, 4, -4]} color="#18D4C8" intensity={0.8} />
      <pointLight position={[4, 2, 4]}  color="#E8B84B" intensity={0.6} />

      {/* Environment */}
      <Environment preset="city" background={false} />

      {/* House */}
      <Suspense fallback={null}>
        <ProceduralHouse
          bedrooms={bedrooms}
          floors={floors}
          propertyType={propertyType}
          color={color}
        />
      </Suspense>

      {/* Dust particles */}
      <Dust />

      {/* Orbit controls — limited range */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
