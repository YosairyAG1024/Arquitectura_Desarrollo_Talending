import { Link, useNavigate } from 'react-router-dom';
import Icon from './icon.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../utils/format.js';

function ProductCard({ p }) {
  const navigate = useNavigate();
  const { favorites = [], toggleFavorite } = useShop();

  const isFav = favorites.includes(p.id);
  const to = `/producto/${p.id}`;
  const img = p.image || p.images?.[0];
  const mainColor = p.colors?.[0]?.hex || 'var(--accent)';
  const soldOut = p.stock <= 0;

  return (
    <article className="pcard" style={{ '--pc': mainColor }}>
      <div className="pcard-media">
        <Link to={to} className="pcard-link" aria-label={`Ver ${p.name}`}>
          {img && <img src={img} alt={p.name} loading="lazy" />}
        </Link>

        {soldOut ? (
          <span className="tag tag-out">Agotado</span>
        ) : (
          p.tag && <span className="tag">{p.tag}</span>
        )}

        <button
          type="button"
          className={`fav ${isFav ? 'on' : ''}`}
          onClick={() => toggleFavorite?.(p.id)}
          aria-pressed={isFav}
          aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Icon name="heart" size={18} />
        </button>

        <button type="button" className="quick" onClick={() => navigate(to)}>
          Ver producto
        </button>
      </div>

      <div className="pcard-info">
        <Link to={to} className="pcard-name">{p.name}</Link>
        <p className="pcard-price">{money(p.price)}</p>
        {p.colors?.length > 0 && (
          <div className="swatches">
            {p.colors.map((c) => (
              <span key={c.name} className="sw" style={{ background: c.hex }} title={c.name} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProductGrid({ products = [], empty = 'No hay productos para mostrar.' }) {
  if (!products.length) return <p className="empty">{empty}</p>;

  return (
    <div className="pgrid">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}