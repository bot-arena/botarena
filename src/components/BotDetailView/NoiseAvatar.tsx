'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Deterministic hash function (cyrb128)
function cyrb128(str: string): number {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

// Mulberry32 PRNG - produces deterministic output for same seed
function mulberry32(a: number) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

interface CellularCanvasProps {
  className?: string;
  fps?: number;
  size?: number;
  seed?: string | undefined;
}

function CellularCanvas({ className, fps = 6, size = 96, seed }: CellularCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const dimension = Math.round(size * devicePixelRatio);
    canvas.width = dimension;
    canvas.height = dimension;

    // Grid size - number of cellular automata cells
    const gridSize = 16;
    const cellSize = Math.floor(dimension / gridSize);
    
    // Generate multiple hash values from seed for different parameters
    const baseHash = seed ? cyrb128(seed) : 0;
    const hueHash = seed ? cyrb128(seed + 'hue') : 0;
    const speedHash = seed ? cyrb128(seed + 'speed') : 0;
    const densityHash = seed ? cyrb128(seed + 'density') : 0;
    
    // ID-derived parameters
    const hue = (hueHash % 360); // Hue 0-359
    const saturation = 70 + (hueHash % 30); // 70-100%
    const lightness = 45 + (hueHash % 25); // 45-70%
    const cellColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const animationFps = 3 + (speedHash % 8); // 3-10 FPS
    const initialDensity = 0.2 + (densityHash % 100) / 200; // 0.2-0.7 (20-70% cells alive initially)
    
    // Create PRNGs for grid initialization
    const random = mulberry32(baseHash);
    
    // Initialize grid with seed-derived random state
    let grid: boolean[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push(random() < initialDensity);
      }
      grid.push(row);
    }

    // Count live neighbors (with toroidal wrapping)
    const countNeighbors = (x: number, y: number): number => {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + gridSize) % gridSize;
          const ny = (y + dy + gridSize) % gridSize;
          if (grid[ny][nx]) count++;
        }
      }
      return count;
    };

    // Update grid one generation
    const updateGrid = () => {
      const newGrid: boolean[][] = [];
      let aliveCount = 0;
      
      for (let y = 0; y < gridSize; y++) {
        const newRow: boolean[] = [];
        for (let x = 0; x < gridSize; x++) {
          const neighbors = countNeighbors(x, y);
          const isAlive = grid[y][x];
          
          // Conway's Game of Life rules
          let nextState: boolean;
          if (isAlive) {
            nextState = neighbors === 2 || neighbors === 3;
          } else {
            nextState = neighbors === 3;
          }
          
          newRow.push(nextState);
          if (nextState) aliveCount++;
        }
        newGrid.push(newRow);
      }
      
      // If pattern dies completely, re-seed from ID
      if (aliveCount === 0 && seed) {
        const reseedRandom = mulberry32(cyrb128(seed + Date.now()));
        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            newGrid[y][x] = reseedRandom() < initialDensity;
          }
        }
      }
      
      // If pattern stabilizes (no change), perturb slightly
      let changed = false;
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (grid[y][x] !== newGrid[y][x]) {
            changed = true;
            break;
          }
        }
        if (changed) break;
      }
      
      if (!changed && aliveCount > 0 && seed) {
        // Perturb a few random cells to prevent stagnation
        const perturbRandom = mulberry32(cyrb128(seed + 'perturb'));
        const perturbCount = 2 + Math.floor(perturbRandom() * 4);
        for (let i = 0; i < perturbCount; i++) {
          const px = Math.floor(perturbRandom() * gridSize);
          const py = Math.floor(perturbRandom() * gridSize);
          newGrid[py][px] = !newGrid[py][px];
        }
      }
      
      grid = newGrid;
    };

    // Render the grid to canvas
    const renderGrid = () => {
      // Clear canvas
      context.clearRect(0, 0, dimension, dimension);
      
      // Draw live cells
      context.fillStyle = cellColor;
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (grid[y][x]) {
            context.fillRect(
              x * cellSize,
              y * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }
    };

    // Animation loop
    let animationId = 0;
    let lastTime = 0;
    const frameDuration = 1000 / animationFps;

    const animate = (time: number) => {
      if (time - lastTime >= frameDuration) {
        lastTime = time;
        updateGrid();
        renderGrid();
      }
      animationId = window.requestAnimationFrame(animate);
    };

    // Initial render
    renderGrid();
    
    // Start animation
    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [fps, size, seed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full', className)}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
}

interface NoiseCanvasProps {
  className?: string;
  fps?: number;
  density?: number;
  size?: number;
  seed?: string | undefined;
}

function NoiseCanvas({ className, fps = 12, density = 0.6, size = 96, seed }: NoiseCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const dimension = Math.round(size * devicePixelRatio);
    canvas.width = dimension;
    canvas.height = dimension;

    const imageData = context.createImageData(dimension, dimension);
    const data = imageData.data;

    // Create PRNG - deterministic if seed provided, random otherwise
    const random = seed ? mulberry32(cyrb128(seed)) : Math.random;

    const renderNoise = () => {
      for (let i = 0; i < data.length; i += 4) {
        const value = (random() * 255) | 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = random() < density ? 255 : 0;
      }
      context.putImageData(imageData, 0, 0);
    };

    // If seed is provided, render once statically (no animation)
    if (seed) {
      renderNoise();
      return;
    }

    // Otherwise, use animated noise (original behavior)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderNoise();
      return;
    }

    let animationId = 0;
    let lastTime = 0;
    const frameDuration = 1000 / fps;

    const animate = (time: number) => {
      if (time - lastTime >= frameDuration) {
        lastTime = time;
        renderNoise();
      }
      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [density, fps, size, seed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full', className)}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
}

interface NoiseAvatarProps {
  icon: string;
  model?: string;
  status?: string;
  className?: string;
  id?: string | undefined;
}

export function NoiseAvatar({
  status = 'NO_SIGNAL',
  className,
  id,
}: NoiseAvatarProps) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      {/* Use Cellular Automata when ID is present, otherwise animated noise */}
      {id ? (
        <CellularCanvas className="absolute inset-0 opacity-60" seed={id} />
      ) : (
        <NoiseCanvas className="absolute inset-0 opacity-40" seed={id} />
      )}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)',
          backgroundSize: '100% 4px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at top, rgba(255, 255, 255, 0.28), transparent 60%)',
        }}
        aria-hidden="true"
      />
      {!id && (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
          <div className="flex items-center gap-2 text-xl uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
            <span className="h-2 w-2 border border-[var(--color-border-strong)] bg-[var(--color-accent-critical)]" aria-hidden="true" />
            {status}
          </div>
        </div>
      )}
    </div>
  );
}
