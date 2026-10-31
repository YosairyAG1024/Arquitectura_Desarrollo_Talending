import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEASONS, seasonByDate } from '../data/seasons.js';
import { PRODUCTS } from '../data/products.js';
import { useAuth } from "../auth/AuthContext.jsx";
import ProductGrid from '../components/ProductGrid.jsx';

const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);

// Estado persistente en LocalStorage
function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [key, value]);
  return [value, setValue];
}

const FREE_SHIPPING = 5000;
const SHIPPING_COST = 250;

export function ShopProvider({ children }) {
  const auth = useAuth();
  const { token, nombre, logout } = auth;

  const [seasonMode, setSeasonMode] = useStored('belizzi:season', 'auto');
  const [cart, setCart] = useStored('belizzi:cart', []);
  const [favorites, setFavorites] = useStored('belizzi:favs', []);
  const [profiles, setProfiles] = useStored('belizzi:profiles', {});
  const [orders, setOrders] = useStored('belizzi:orders', []);
  const [toast, setToast] = useState(null);
  const [wipe, setWipe] = useState(null);

  /* ---------- Temporada ---------- */
  const seasonId = seasonMode === 'auto' ? seasonByDate() : seasonMode;
  const season = SEASONS[seasonId] || SEASONS.otoño;

  useEffect(() => {
    document.documentElement.dataset.season = season.id;
  }, [season.id]);

  const changeSeason = (mode, pos) => {
    if (mode === seasonMode) return;
    const target = mode === 'auto' ? seasonByDate() : mode;
    if (target === season.id) {
      setSeasonMode(mode);
      return;
    }
    setWipe({
      id: Date.now(),
      season: target,
      x: pos?.x ?? window.innerWidth / 2,
      y: pos?.y ?? 40
    });
    setTimeout(() => setSeasonMode(mode), 450);
    setTimeout(() => setWipe(null), 1100);
  };

  /* ---------- Toast ---------- */
  const showToast = useCallback((msg) => setToast({ id: Date.now(), msg }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---------- Carrito ---------- */
  const addToCart = (product, { size, color, qty = 1 } = {}) => {
    const s = size || product.sizes[0];
    const c = color || product.colors[0].name;
    const key = `${product.id}|${s}|${c}`;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      return found
        ? prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i))
        : [...prev, { key, id: product.id, size: s, color: c, qty }];
    });
    showToast(`${product.name} se agregó al carrito`);
  };

  const updateItem = (key, patch) =>
    setCart((prev) => {
      const next = prev.map((i) =>
        i.key === key ? { ...i, ...patch, key: `${i.id}|${patch.size ?? i.size}|${i.color}` } : i
      );
      const merged = new Map();
      next.forEach((i) => {
        const e = merged.get(i.key);
        merged.set(i.key, e ? { ...e, qty: Math.min(e.qty + i.qty, 10) } : i);
      });
      return [...merged.values()];
    });

  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));
  const clearCart = () => setCart([]);

  const cartItems = useMemo(
    () =>
      cart
        .map((i) => {
          const product = PRODUCTS.find((p) => p.id === i.id);
          return product
            ? { ...i, product, hex: product.colors.find((c) => c.name === i.color)?.hex }
            : null;
        })
        .filter(Boolean),
    [cart]
  );
  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0);
  const subtotal = cartItems.reduce((n, i) => n + i.qty * i.product.price, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  /* ---------- Favoritos ---------- */
  const isFav = (id) => favorites.includes(id);
  const toggleFav = (product) => {
    const has = favorites.includes(product.id);
    setFavorites((prev) => (has ? prev.filter((x) => x !== product.id) : [...prev, product.id]));
    showToast(has ? 'Quitado de favoritos' : `${product.name} se guardó en favoritos`);
  };

  /* ---------- Usuario: viene de la sesión de tu API ---------- */
  const userKey = token ? auth.email || nombre || 'usuario' : null;

  const user = token
    ? {
        phone: '',
        address: '',
        ...(profiles[userKey] || {}),
        name: nombre || 'Cliente',
        email: auth.email || ''
      }
    : null;

  // Solo guarda datos propios de BELIZZI; el nombre lo manda la API
  const updateProfile = ({ phone, address }) =>
    setProfiles((prev) => ({ ...prev, [userKey]: { ...(prev[userKey] || {}), phone, address } }));

  /* ---------- Pedidos ---------- */
  const myOrders = orders.filter((o) => o.email === userKey);

  const placeOrder = () => {
    const order = {
      id: `BZ-${Date.now().toString().slice(-6)}`,
      email: userKey,
      date: new Date().toISOString(),
      total,
      items: cartItems.map((i) => ({
        name: i.product.name, qty: i.qty, size: i.size, color: i.color, price: i.product.price
      }))
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const value = {
    season, seasonMode, changeSeason, wipe,
    toast, showToast,
    cartItems, cartCount, subtotal, shipping, total, addToCart, updateItem, removeItem,
    favorites, isFav, toggleFav,
    user, logout, updateProfile,
    myOrders, placeOrder,
    FREE_SHIPPING
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}