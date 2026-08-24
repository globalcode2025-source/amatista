import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function Reveal({ children, delay = 0, className = '', direction = 'up' }: RevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ once: true, delay });

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${directionClasses[direction]} ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}

export default Reveal;
