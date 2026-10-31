// Ilustraciones vectoriales de prendas (sirven de "foto" hasta que haya imágenes reales)
const SHAPES = {
  shirt: (
    <>
      <path d="M38 20 20 34 10 62l16 6 6-14v76h56V54l6 14 16-6-10-28-18-14Q60 38 38 20Z" />
      <path fill="none" d="M38 20Q60 44 82 20M60 40v90" />
    </>
  ),
  pants: (
    <>
      <path d="M34 14h52l6 124H66L60 62l-6 76H28Z" />
      <path fill="none" d="M34 24h52M60 24v38" />
    </>
  ),
  dress: (
    <>
      <path d="M44 10h8l8 20 8-20h8l-2 40 24 88H22l24-88Z" />
      <path fill="none" d="M46 50h28M52 10l8 20 8-20" />
    </>
  ),
  skirt: (
    <>
      <path d="M38 28h44l22 104H16Z" />
      <path fill="none" d="M38 40h44M50 40 40 132M60 40v92M70 40l10 92" />
    </>
  ),
  jacket: (
    <>
      <path d="M36 16 14 36 8 102l18 4 4-44v70h60V62l4 44 18-4-6-66-22-20-24 32Z" />
      <path fill="none" d="M60 48v82M48 70h4M48 90h4" />
    </>
  ),
  shoes: (
    <>
      <path d="M12 94Q12 66 36 62l16 22q30 2 56 12 8 12 0 18H18q-8-2-6-20Z" />
      <path fill="none" d="M14 108h92M36 62l6 14" />
    </>
  ),
  bag: (
    <>
      <path d="M26 56h68l8 72H18Z" />
      <path fill="none" d="M44 56Q44 22 60 22T76 56M26 76h68" />
    </>
  ),
  glasses: (
    <>
      <circle cx="36" cy="76" r="20" />
      <circle cx="84" cy="76" r="20" />
      <path fill="none" d="M56 74q4-5 8 0M16 70 6 56M104 70l10-14" />
    </>
  ),
  scarf: (
    <>
      <path d="M40 12h40v58l14 66H72l-12-50-12 50H26l14-66Z" />
      <path fill="none" d="M40 26h40M44 120l-2 14M60 120v14M76 120l2 14" />
    </>
  )
};

export default function Garment({ kind = 'shirt', color = '#cccccc', className = '' }) {
  return (
    <svg viewBox="0 0 120 150" className={`garment ${className}`} aria-hidden="true">
      <ellipse cx="60" cy="144" rx="38" ry="4" fill="rgba(0,0,0,.14)" />
      <g style={{ fill: color }} stroke="rgba(0,0,0,.28)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {SHAPES[kind] || SHAPES.shirt}
      </g>
    </svg>
  );
}
