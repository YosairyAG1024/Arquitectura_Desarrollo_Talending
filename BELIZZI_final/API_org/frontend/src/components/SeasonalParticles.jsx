import { useMemo } from 'react';

// Efecto ambiental: pétalos, destellos, hojas o nieve según la temporada
export default function SeasonalParticles({ type }) {
  const items = useMemo(
    () =>
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        size: 8 + Math.random() * 14,
        delay: -Math.random() * 16,
        dur: 11 + Math.random() * 10,
        drift: (Math.random() * 2 - 1) * 90
      })),
    [type]
  );

  return (
    <div className={`particles ${type}`} aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            '--drift': `${p.drift}px`
          }}
        />
      ))}
    </div>
  );
}
