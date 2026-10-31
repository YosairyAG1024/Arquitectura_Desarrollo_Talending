import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/icon.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../utils/format.js';

export default function Cart() {
  const { cartItems, subtotal, shipping, total, updateItem, removeItem, user, placeOrder, FREE_SHIPPING } = useShop();
  const [done, setDone] = useState(null);
  const navigate = useNavigate();

  const checkout = () => {
    if (!user) return navigate('/login', { state: { from: '/carrito' } });
    return setDone(placeOrder());
  };

  if (done) {
    return (
      <div className="page center done">
        <div className="done-mark"><Icon name="check" size={34} /></div>
        <h1>Pedido confirmado</h1>
        <p>Tu pedido <b>{done.id}</b> quedó registrado por {money(done.total)}. (Simulación: aún no hay pagos reales.)</p>
        <div className="row-btns">
          <Link to="/perfil" className="btn">Ver mis pedidos</Link>
          <Link to="/catalogo" className="btn btn-ghost">Seguir comprando</Link>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="page center">
        <h1>Tu carrito está vacío</h1>
        <p className="muted">Agrega prendas desde el catálogo y aparecerán aquí.</p>
        <Link to="/catalogo" className="btn">Explorar el catálogo</Link>
      </div>
    );
  }

  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <div className="page">
      <h1>Tu carrito</h1>
      <div className="cart">
        <ul className="cart-list">
          {cartItems.map((i) => (
            <li key={i.key} className="cart-item">
              <Link to={`/producto/${i.product.id}`} className="ci-img" style={{ '--pc': i.hex }}>
                <Garment kind={i.product.kind} color={i.hex} />
              </Link>
              <div className="ci-info">
                <Link to={`/producto/${i.product.id}`} className="pcard-name">{i.product.name}</Link>
                <p className="muted">{i.color}</p>
                <label className="select sm">
                  <span className="sr">Talla</span>
                  <select value={i.size} onChange={(e) => updateItem(i.key, { size: e.target.value })}>
                    {i.product.sizes.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <div className="qty">
                <button onClick={() => updateItem(i.key, { qty: Math.max(1, i.qty - 1) })} aria-label="Menos"><Icon name="minus" size={16} /></button>
                <span>{i.qty}</span>
                <button onClick={() => updateItem(i.key, { qty: Math.min(10, i.qty + 1) })} aria-label="Más"><Icon name="plus" size={16} /></button>
              </div>
              <p className="ci-price">{money(i.product.price * i.qty)}</p>
              <button className="icon-btn" onClick={() => removeItem(i.key)} aria-label={`Eliminar ${i.product.name}`}><Icon name="trash" size={20} /></button>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <h2>Resumen</h2>
          <div className="ship-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
          <p className="muted">
            {subtotal >= FREE_SHIPPING
              ? 'Tienes envío gratis.'
              : `Te faltan ${money(FREE_SHIPPING - subtotal)} para el envío gratis.`}
          </p>
          <dl>
            <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div><dt>Envío</dt><dd>{shipping ? money(shipping) : 'Gratis'}</dd></div>
            <div className="total"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
          <button className="btn btn-block" onClick={checkout}>{user ? 'Finalizar compra' : 'Inicia sesión para comprar'}</button>
        </aside>
      </div>
    </div>
  );
}
