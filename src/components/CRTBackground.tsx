'use client';

import * as React from 'react';

/**
 * CRT monitor background effect component.
 * Renders animated scanlines and subtle vignette overlay.
 * Uses canvas for animation and CSS for base layer.
 */
export function CRTBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw scanlines
    const drawScanlines = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create subtle animated scanline effect
      const time = Date.now() / 1000;
      const offset = (time * 0.5) % 4; // Very slow animation

      // Draw horizontal scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let y = -4 + offset; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }

      // Add subtle vignette
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    let animationId: number;
    const animate = () => {
      drawScanlines();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* CSS-based scanline overlay for base layer */}
      <div className="crt-scanlines" aria-hidden="true" />
      {/* Animated canvas overlay */}
      <canvas ref={canvasRef} className="crt-canvas" aria-hidden="true" />
    </>
  );
}
