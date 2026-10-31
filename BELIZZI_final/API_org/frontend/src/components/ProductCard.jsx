import { useState } from 'react';
import { Link } from 'react-router-dom';
import Garmment from './Garmment.jsx';
import Icon from '../components/icon.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { isFav, toggleFav, addToCart } = useShop();
  const [colorIdx, setColorIdx] = useState(0);
  const color = product.colors[colorIdx];
  const fav = isFav(product.id);
  const soldOut = product.stock === 0;

  return (
    <article className="pcard">
      <div className="pcard-media" style={{ '--pc': color.hex }}>
        <Link to={`/producto/${product.id}`} className="pcard-link" aria-label={`Ver ${product.name}`}>
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" />
          ) : (
            <Garmment kind={product.kind} color={color.hex} />
          )}
        </Link>
        {product.isNew && <span className="tag">Nuevo</span>}
        {soldOut && <span className="tag tag-out">Agotado</span>}
        <button
          type="button"
          className={`fav ${fav ? 'on' : ''}`}
          onClick={() => toggleFav(product)}
          aria-pressed={fav}
          aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Icon name="heart" size={20} filled={fav} />
        </button>
        {!soldOut && (
          <button
            type="button"
            className="quick"
            onClick={() => addToCart(product, { color: color.name })}
          >
            Agregar rápido
          </button>
        )}
      </div>
      <div className="pcard-info">
        <Link to={`/producto/${product.id}`} className="pcard-name">{product.name}</Link>
        <p className="pcard-price">{money(product.price)}</p>
        <div className="swatches" role="group" aria-label="Colores">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              className={`sw ${i === colorIdx ? 'on' : ''}`}
              style={{ background: c.hex }}
              onClick={() => setColorIdx(i)}
              title={c.name}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
