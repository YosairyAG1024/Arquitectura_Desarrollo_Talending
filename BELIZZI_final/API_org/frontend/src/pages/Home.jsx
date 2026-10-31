import { Link } from 'react-router-dom';
import SeasonalBanner from '../components/SeasonalBanner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { useShop } from '../context/ShopContext.jsx';
import Garmment from '../components/Garmment.jsx'

export default function Home() {
  const { season } = useShop();
  const popular = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const news = PRODUCTS.filter((p) => p.isNew);
  const text = [...season.marquee, ...season.marquee, ...season.marquee];

  return (
    <>
      <SeasonalBanner />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...text, ...text].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      <section className="section">
        <Reveal as="header" className="section-head">
          <h2>Colecciones de {season.name.toLowerCase()}</h2>
          <Link to="/catalogo?cat=temporada" className="link">Ver todo</Link>
        </Reveal>
        <div className="collections">
          {season.collections.map((c, i) => (
            <Reveal key={c.title} delay={i * 110}>
              <Link to={`/catalogo?cat=${c.cat}`} className="collection">
                <div className="arch-tile"><Garmment kind={c.kind} color="var(--accent-ink)" /></div>
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal as="header" className="section-head">
          <h2>Productos populares</h2>
          <Link to="/catalogo" className="link">Ver catálogo</Link>
        </Reveal>
      </section>

      <section className="section">
        <Reveal as="header" className="section-head"><h2>Novedades</h2></Reveal>
        <div className="hscroll">
          {news.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="section promos">
        <Reveal className="promo promo-a">
          <h3>{season.promo}</h3>
          <p>Por tiempo limitado en la colección de {season.name.toLowerCase()}.</p>
          <Link to="/catalogo?cat=temporada" className="btn btn-light">Aprovechar</Link>
        </Reveal>
        <Reveal className="promo promo-b" delay={120}>
          <h3>Envío gratis desde RD$ 5,000</h3>
          <p>Compra tu look completo y recíbelo sin costo de envío.</p>
          <Link to="/catalogo" className="btn btn-light">Armar mi look</Link>
        </Reveal>
      </section>

      <section className="section">
        <Reveal as="header" className="section-head"><h2>Categorías destacadas</h2></Reveal>
        <Reveal className="cats">
          {CATEGORIES.filter((c) => c.kind).map((c) => (
            <Link key={c.id} to={`/catalogo?cat=${c.id}`} className="cat">
              <span className="cat-arch"><Garmment kind={c.kind} color="var(--accent)" /></span>
              {c.label}
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}
