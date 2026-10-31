import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products.js';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../utils/format.js';

const TABS = ['Perfil', 'Favoritos', 'Pedidos', 'Configuración'];

export default function Profile() {
  const { user, logout, updateProfile, favorites, myOrders, changeSeason, seasonMode, showToast } = useShop();
  const [tab, setTab] = useState('Perfil');
  const [form, setForm] = useState({ phone: user?.phone || '', address: user?.address || '' });

  if (!user) return <Navigate to="/login" replace />;

  const save = (e) => {
    e.preventDefault();
    updateProfile(form);
    showToast('Cambios guardados');
  };

  return (
    <div className="page">
      <div className="profile-head">
        <div className="avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h1>Hola, {user.name.split(' ')[0]}</h1>
          {user.email && <p className="muted">{user.email}</p>}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>Cerrar sesión</button>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Perfil' && (
        <form className="auth-form wide" onSubmit={save}>
          <label>Nombre<input value={user.name} disabled /></label>
          <label>Teléfono<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" /></label>
          <label>Dirección de envío<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <button className="btn">Guardar cambios</button>
        </form>
      )}

      {tab === 'Favoritos' && (
        <ProductGrid products={PRODUCTS.filter((p) => favorites.includes(p.id))} empty="Todavía no guardas favoritos." />
      )}

      {tab === 'Pedidos' && (
        myOrders.length ? (
          <ul className="orders">
            {myOrders.map((o) => (
              <li key={o.id}>
                <div className="o-head">
                  <b>{o.id}</b>
                  <span className="muted">{new Date(o.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <b>{money(o.total)}</b>
                </div>
                <p className="muted">{o.items.map((i) => `${i.qty}× ${i.name} (${i.color}, ${i.size})`).join(' · ')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Aún no tienes pedidos. <Link to="/catalogo" className="link">Explorar el catálogo</Link></p>
        )
      )}

      {tab === 'Configuración' && (
        <div className="auth-form wide">
          <h3>Temporada de la tienda</h3>
          <p className="muted">Automática sigue la fecha actual. También puedes fijar una temporada.</p>
          <div className="chips">
            {['auto', 'primavera', 'verano', 'otoño', 'invierno'].map((s) => (
              <button key={s} className={`chip ${seasonMode === s ? 'on' : ''}`} onClick={(e) => changeSeason(s, { x: e.clientX, y: e.clientY })}>
                {s === 'auto' ? 'Automática' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}