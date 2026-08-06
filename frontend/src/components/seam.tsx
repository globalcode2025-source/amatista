import { useEffect, useRef, useState } from 'react';

type Variant = 1 | 2 | 3 | 4 | 5;

const VARIANTS: Record<Variant, { path: string; branch: string }> = {
  1: {
    path: 'M0 40 C 180 10, 260 60, 420 32 S 700 5, 900 38 S 1100 55, 1180 30',
    branch: 'M420 32 L 440 8 M900 38 L 925 62',
  },
  2: {
    path: 'M0 30 C 200 55, 300 5, 460 30 S 760 58, 950 25 S 1100 10, 1180 40',
    branch: 'M460 30 L 480 55 M950 25 L 970 2',
  },
  3: {
    path: 'M0 45 C 220 12, 340 62, 520 28 S 800 8, 960 45 S 1090 60, 1180 20',
    branch: 'M520 28 L 505 5 M960 45 L 940 65',
  },
  4: {
    path: 'M0 20 C 190 50, 310 8, 480 35 S 720 60, 900 22 S 1080 8, 1180 45',
    branch: 'M480 35 L 460 60 M900 22 L 915 2',
  },
  5: {
    path: 'M0 35 C 210 5, 330 58, 500 30 S 780 10, 940 40 S 1080 55, 1180 25',
    branch: 'M500 30 L 480 8 M940 40 L 960 60',
  },
};

export interface SeamProps {
  /** color de fondo de la franja, según la sección de arriba/abajo */
  background?: 'cream' | 'dark';
  /** forma de la grieta — varía para que no se repita idéntica entre secciones */
  variant?: Variant;
}

export function Seam({ background = 'cream', variant = 1 }: SeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setVisible(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);

    // respaldo: si por lo que sea el observer no dispara, la línea igual aparece
    const fallback = setTimeout(reveal, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const { path, branch } = VARIANTS[variant];
  const bgClass = background === 'dark' ? 'bg-amatista-deep' : 'bg-cream';
  const dashClass = visible ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:900]';

  return (
    <div ref={ref} className={`relative h-[70px] overflow-hidden ${bgClass}`}>
      <svg viewBox="0 0 1180 70" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
        <path
          d={path}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={2}
          strokeLinecap="round"
          className={`[stroke-dasharray:900] transition-[stroke-dashoffset] duration-[1.6s] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${dashClass}`}
        />
        <path
          d={branch}
          fill="none"
          stroke="var(--color-gold-light)"
          strokeWidth={1}
          strokeLinecap="round"
          className={`[stroke-dasharray:900] transition-[stroke-dashoffset] delay-150 duration-[1.6s] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${dashClass}`}
        />
      </svg>
    </div>
  );
}

export default Seam;