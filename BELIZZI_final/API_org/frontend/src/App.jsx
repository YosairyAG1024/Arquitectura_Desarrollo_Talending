import { useEffect } from 'react';
import { Link, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Productos from './pages/Productos.jsx';
import Notificaciones from './pages/Notificaciones.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SeasonalParticles from './components/SeasonalParticles.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Favorites from './pages/Favorites.jsx';
import Profile from './pages/Profile.jsx';
import { useShop } from './context/ShopContext.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function ApiLayout() {
  const { token, nombre, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">
      <header className="nav">
        <strong>Belizzi</strong>
        {token && (
          <nav>
            <Link to="/productos">Productos</Link>
            <Link to="/notificaciones">Notificaciones</Link>
            <span className="muted">Hola, {nombre}</span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Salir
            </button>
          </nav>
        )}
      </header>

      <Outlet />
    </div>
  );
}

export default function App() {
  const { season, toast, wipe } = useShop();

  return (
    <>
      <SeasonalParticles type={season.particle} />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/perfil" element={<Profile />} />

          <Route element={<ApiLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
            <Route path="/notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />
          </Route>

          <Route
            path="*"
            element={
              <div className="page center">
                <h1>Esta página no existe</h1>
                <Link to="/" className="btn">Volver al inicio</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />

      {wipe && <div key={wipe.id} className="wipe" data-s={wipe.season} style={{ '--x': `${wipe.x}px`, '--y': `${wipe.y}px` }} />}
      {toast && <div key={toast.id} className="toast" role="status">{toast.msg}</div>}
    </>
  );
}