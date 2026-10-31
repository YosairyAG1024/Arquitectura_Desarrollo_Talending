import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products.js';
import { useShop } from '../context/ShopContext.jsx';

export default function Favorites() {
  const { favorites, addToCart } = useShop();
  const items = PRODUCTS.filter((p) => favorites.includes(p.id));

  if (!items.length) {
    return (
      <div className="page center">
        <h1>Aún no tienes favoritos</h1>
        <p className="muted">Toca el corazón de una prenda para guardarla aquí.</p>
        <Link to="/catalogo" className="btn">Explorar el catálogo</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="cat-head">
        <h1>Mis favoritos</h1>
        <button className="btn btn-sm" onClick={() => items.filter((p) => p.stock > 0).forEach((p) => addToCart(p))}>
          Agregar todos al carrito
        </button>
      </div>
      <ProductGrid products={items} />
    </div>
  );
}
