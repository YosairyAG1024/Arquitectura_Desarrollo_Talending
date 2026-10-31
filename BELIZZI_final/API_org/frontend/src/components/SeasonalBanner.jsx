import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Garment from './Garmment.jsx';
import { PRODUCTS } from '../data/products.js';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../utils/format.js';

export default function SeasonalBanner() {
  const { season } = useShop();
  const ref = useRef(null);

  const picks = useMemo(
    () =>
      PRODUCTS.filter((p) => p.seasons.includes(season.id))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 3),
    [season.id]
  );

  // Parallax suave con el mouse
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  return (
    <section className="hero" ref={ref} onMouseMove={onMove}>
      <div className="hero-copy" key={season.id}>
        <h1>
          {season.headline.split(' ').map((w, i) => (
            <span key={i} className="hw" style={{ '--i': i }}>{w}</span>
          ))}
        </h1>
        <p className="hero-text">{season.text}</p>
        <div className="hero-cta">
          <Link to="/catalogo?cat=temporada" className="btn">Ver colección de {season.name.toLowerCase()}</Link>
          <Link to="/catalogo?cat=novedades" className="btn btn-ghost">Explorar novedades</Link>
        </div>
      </div>

      <div className="hero-arches" key={`a-${season.id}`}>
        {picks.map((p, i) => (
          <Link key={p.id} to={`/producto/${p.id}`} className={`arch a${i + 1}`} style={{ '--pc': p.colors[0].hex }}>
            <Garment kind={p.kind} color={p.colors[0].hex} />
            <span className="arch-cap">
              {p.name}
              <small>{money(p.price)}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
