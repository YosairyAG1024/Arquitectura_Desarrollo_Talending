import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './icon.jsx';
import SeasonSwitcher from './SeasonalSwitcher.jsx';
import { useShop } from '../context/ShopContext.jsx';
export default function Navbar() {
  const { cartCount, favorites, user, season } = useShop();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/catalogo?q=${encodeURIComponent(q.trim())}` : '/catalogo');
    setQ('');
  };

  return (
    <>
      <div className="topbar">
        <p>{season.promo}</p>
        <SeasonSwitcher />
      </div>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <button className="icon-btn burger" onClick={() => setOpen((o) => !o)} aria-label="Menú" aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
        <Logo />
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/catalogo?cat=mujer">Mujer</NavLink>
          <NavLink to="/catalogo?cat=hombre">Hombre</NavLink>
          <NavLink to="/catalogo" end>Catálogo</NavLink>
          <NavLink to="/catalogo?cat=novedades">Novedades</NavLink>
          <NavLink to="/catalogo?cat=temporada">{season.name}</NavLink>
        </nav>
        <form className="search" onSubmit={submit} role="search">
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar prendas" aria-label="Buscar productos" />
        </form>
        <div className="nav-icons">
          <Link to={user ? '/perfil' : '/login'} className="icon-btn" aria-label={user ? 'Mi perfil' : 'Iniciar sesión'}>
            <Icon name="user" />
          </Link>
          <Link to="/favoritos" className="icon-btn" aria-label="Favoritos">
            <Icon name="heart" />
            {favorites.length > 0 && <b className="badge">{favorites.length}</b>}
          </Link>
          <Link to="/carrito" className="icon-btn" aria-label="Carrito">
            <Icon name="bag" />
            {cartCount > 0 && <b className="badge" key={cartCount}>{cartCount}</b>}
          </Link>
        </div>
      </header>
    </>
  );
}