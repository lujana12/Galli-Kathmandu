import React, { useCallback, useRef, useState } from 'react';
import type { Language } from '../data/i18n';

interface VirtualJoystickProps {
  lang?: Language;
  onVectorChange: (vx: number, vy: number) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  lang = 'en',
  onVectorChange,
}) => {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const activePointerId = useRef<number | null>(null);
  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const maxRadius = 34;

  const updateFromClientPos = useCallback(
    (clientX: number, clientY: number) => {
      const el = baseRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      setKnobOffset({ x: dx, y: dy });
      const normX = Math.abs(dx) < 4 ? 0 : dx / maxRadius;
      const normY = Math.abs(dy) < 4 ? 0 : dy / maxRadius;
      onVectorChange(normX, normY);
    },
    [onVectorChange]
  );

  const resetStick = useCallback(() => {
    activePointerId.current = null;
    setIsDragging(false);
    setKnobOffset({ x: 0, y: 0 });
    onVectorChange(0, 0);
  }, [onVectorChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    activePointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientPos(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    updateFromClientPos(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    resetStick();
  };

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-1.5 select-none">
      <div
        ref={baseRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="application"
        aria-label="Virtual movement joystick"
        className="relative w-24 h-24 rounded-full bg-[#1B120D]/88 border-2 border-[#A87D44]/75 shadow-[0_12px_30px_rgba(0,0,0,0.65)] touch-none cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        {/* Subtle compass ticks inside joystick ring */}
        <span className="absolute top-2 text-[9px] font-bold text-[#C89232]/70">N</span>
        <span className="absolute bottom-2 text-[9px] font-bold text-[#C89232]/50">S</span>
        <span className="absolute left-2.5 text-[9px] font-bold text-[#C89232]/50">W</span>
        <span className="absolute right-2.5 text-[9px] font-bold text-[#C89232]/50">E</span>

        <div className="w-12 h-12 rounded-full border border-[#6E4F37]/60 pointer-events-none" />

        {/* Brass-trimmed joystick thumb */}
        <div
          style={{
            transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
            transition: isDragging ? 'none' : 'transform 140ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute w-10 h-10 rounded-full bg-gradient-to-b from-[#D99B38] to-[#9E6B21] border-2 border-[#F7E6C4] shadow-lg pointer-events-none flex items-center justify-center"
        >
          <div className="w-3 h-3 rounded-full bg-[#8D2C1D]" />
        </div>
      </div>
      <span className="text-[10px] font-medium text-[#D5C3AD] tracking-wide">
        {lang === 'ne' ? 'हिँड्न · WASD / जोयस्टिक' : 'Walk · WASD / Joystick'}
      </span>
    </div>
  );
};
