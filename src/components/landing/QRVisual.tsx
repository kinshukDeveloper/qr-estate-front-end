'use client';

import { motion } from 'framer-motion';

// 12×12 QR matrix — (row, col) pairs that are filled
export const QR_FILLED: [number, number][] = [
  // Top-left finder
  [0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,4],[2,0],[2,2],[2,4],[3,0],[3,4],[4,0],[4,1],[4,2],[4,3],[4,4],
  // Top-right finder
  [0,7],[0,8],[0,9],[0,10],[0,11],[1,7],[1,11],[2,7],[2,9],[2,11],[3,7],[3,11],[4,7],[4,8],[4,9],[4,10],[4,11],
  // Bottom-left finder
  [7,0],[7,1],[7,2],[7,3],[7,4],[8,0],[8,4],[9,0],[9,2],[9,4],[10,0],[10,4],[11,0],[11,1],[11,2],[11,3],[11,4],
  // Inner squares (dim)
  [2,1],[2,3],[3,1],[3,2],[3,3],[9,1],[9,3],[10,1],[10,2],[10,3],[2,8],[2,10],[3,8],[3,9],[3,10],
  // Data modules
  [6,2],[6,5],[6,6],[6,8],[6,10],
  [7,6],[7,8],[7,9],[7,11],
  [8,6],[8,7],[8,9],
  [9,6],[9,7],[9,9],[9,10],[9,11],
  [10,6],[10,8],[10,10],
  [11,6],[11,7],[11,9],[11,11],
];

export const QR_DIM: [number, number][] = [
  [2,1],[2,3],[3,1],[3,2],[3,3],
  [9,1],[9,3],[10,1],[10,2],[10,3],
  [2,8],[2,10],[3,8],[3,9],[3,10],
];

interface QRVisualProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function QRVisual({ size = 200, className = '', animate = false }: QRVisualProps) {
  const cell = size / 12;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="#0D1821" />
      {/* Grid lines */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * cell} x2={size} y2={i * cell} stroke="#1A2D40" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * cell} y1={0} x2={i * cell} y2={size} stroke="#1A2D40" strokeWidth="0.5" />
      ))}
      {/* Dim inner cells */}
      {QR_DIM.map(([r, c]) => (
        animate ? (
          <motion.rect
            key={`d${r}${c}`}
            x={c * cell + 1} y={r * cell + 1}
            width={cell - 2} height={cell - 2}
            fill="#007A74" opacity={0.5}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ delay: (r * 12 + c) * 0.008, type: 'spring', stiffness: 200 }}
          />
        ) : (
          <rect key={`d${r}${c}`} x={c * cell + 1} y={r * cell + 1} width={cell - 2} height={cell - 2} fill="#007A74" opacity="0.5" />
        )
      ))}
      {/* Filled cells */}
      {QR_FILLED.map(([r, c]) => (
        animate ? (
          <motion.rect
            key={`f${r}${c}`}
            x={c * cell + 1} y={r * cell + 1}
            width={cell - 2} height={cell - 2}
            fill="#00D4C8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (r * 12 + c) * 0.006, type: 'spring', stiffness: 300, damping: 20 }}
          />
        ) : (
          <rect key={`f${r}${c}`} x={c * cell + 1} y={r * cell + 1} width={cell - 2} height={cell - 2} fill="#00D4C8" />
        )
      ))}
    </svg>
  );
}
