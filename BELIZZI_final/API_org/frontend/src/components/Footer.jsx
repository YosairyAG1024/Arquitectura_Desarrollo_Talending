import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Logo />
          <p className="muted">Tu estilo, tu temporada. Moda de inspiración italiana que cambia con el año.</p>
        </div>
        <div>
          <h4>Tienda</h4>
          <Link to="/catalogo?cat=mujer">Mujer</Link>
          <Link to="/catalogo?cat=hombre">Hombre</Link>
          <Link to="/catalogo?cat=novedades">Novedades</Link>
          <Link to="/catalogo?cat=temporada">Colección de temporada</Link>
        </div>
        <div>
          <h4>Mi cuenta</h4>
          <Link to="/perfil">Perfil</Link>
          <Link to="/favoritos">Favoritos</Link>
          <Link to="/carrito">Carrito</Link>
        </div>
        <div>
          <h4>Recibe las novedades</h4>
          {sent ? (
            <p className="ok">Listo, te avisaremos de cada colección.</p>
          ) : (
            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input type="email" required placeholder="Tu correo" aria-label="Correo" />
              <button className="btn btn-sm">Suscribirme</button>
            </form>
          )}
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} BELIZZI · Santo Domingo, República Dominicana</p>
    </footer>
  );
}
