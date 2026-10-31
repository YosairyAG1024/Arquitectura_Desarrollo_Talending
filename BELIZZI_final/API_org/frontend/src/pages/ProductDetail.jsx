import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Garment from '../components/Garmment.jsx';
import Icon from '../components/icon.jsx';
import { PRODUCTS } from '../data/products.js';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../utils/format.js';

const VIEWS = [
  { label: 'Frente', scale: 1 },
  { label: 'Detalle', scale: 1.8 },
  { label: 'En contraste', scale: 1, alt: true }
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  const { addToCart, isFav, toggleFav } = useShop();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [origin, setOrigin] = useState('50% 50%');
  const [needSize, setNeedSize] = useState(false);

  if (!product) {
    return (
      <div className="page center">
        <h1>Producto no encontrado</h1>
        <Link to="/catalogo" className="btn">Volver al catálogo</Link>
      </div>
    );
  }

  const color = product.colors[colorIdx];
  const v = VIEWS[view];
  const soldOut = product.stock === 0;
  const related = PRODUCTS.filter((p) => p.type === product.type && p.id !== product.id).slice(0, 4);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const add = () => {
    if (!size && product.sizes.length > 1) return setNeedSize(true);
    setNeedSize(false);
    return addToCart(product, { size: size || product.sizes[0], color: color.name, qty });
  };

  return (
    <div className="page">
      <p className="crumbs"><Link to="/">Inicio</Link> / <Link to="/catalogo">Catálogo</Link> / {product.name}</p>
      <div className="detail">
        <div className="gallery">
          <div className="stage" style={{ '--pc': v.alt ? 'var(--deep)' : color.hex }} onMouseMove={onMove}>
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <Garment kind={product.kind} color={color.hex} className="stage-g" />
            )}
            <style>{`.stage-g{transform:scale(${v.scale});transform-origin:${origin}}`}</style>
          </div>
          <div className="thumbs">
            {VIEWS.map((x, i) => (
              <button key={x.label} className={`thumb ${i === view ? 'on' : ''}`} style={{ '--pc': x.alt ? 'var(--deep)' : color.hex }} onClick={() => setView(i)} aria-label={x.label}>
                <Garment kind={product.kind} color={color.hex} />
              </button>
            ))}
          </div>
        </div>

        <div className="info">
          <h1>{product.name}</h1>
          <p className="price">{money(product.price)}</p>
          <p className="desc">{product.description}</p>

          <div className="opt">
            <h3>Color: <span>{color.name}</span></h3>
            <div className="swatches big">
              {product.colors.map((c, i) => (
                <button key={c.name} className={`sw ${i === colorIdx ? 'on' : ''}`} style={{ background: c.hex }} onClick={() => setColorIdx(i)} aria-label={c.name} title={c.name} />
              ))}
            </div>
          </div>

          <div className="opt">
            <h3>Talla</h3>
            <div className="chips">
              {product.sizes.map((s) => (
                <button key={s} className={`chip ${size === s ? 'on' : ''}`} onClick={() => { setSize(s); setNeedSize(false); }}>{s}</button>
              ))}
            </div>
            {needSize && <p className="error" role="alert">Elige una talla para continuar.</p>}
          </div>

          <div className="opt row">
            <div className="qty">
              <button onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Menos"><Icon name="minus" size={16} /></button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty((n) => Math.min(10, n + 1))} aria-label="Más"><Icon name="plus" size={16} /></button>
            </div>
            <button className="btn grow" onClick={add} disabled={soldOut}>{soldOut ? 'Agotado' : 'Agregar al carrito'}</button>
            <button className={`fav-lg ${isFav(product.id) ? 'on' : ''}`} onClick={() => toggleFav(product)} aria-pressed={isFav(product.id)} aria-label="Favoritos">
              <Icon name="heart" filled={isFav(product.id)} />
            </button>
          </div>

          <p className="ship"><Icon name="truck" size={18} /> Envío gratis en compras desde RD$ 5,000</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <header className="section-head"><h2>Productos relacionados</h2></header>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
