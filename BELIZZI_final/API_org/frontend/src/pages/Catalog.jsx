import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryMenu from '../components/CategoryMenu.jsx';
import Icon from '../components/icon.jsx';
import { CATEGORIES, MAX_PRICE, PRODUCTS, TYPES, matchCat } from '../data/products.js';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../utils/format.js';
import ProductGrid from '../components/ProductGrid.jsx';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42', '44', 'Única'];
const ALL_COLORS = [...new Map(PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];

const toggle = (list, setList, v) => setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function Catalog() {
  const [params] = useSearchParams();
  const cat = params.get('cat') || 'todo';
  const q = (params.get('q') || '').toLowerCase();
  const { season } = useShop();

  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [types, setTypes] = useState([]);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [sort, setSort] = useState('popular');
  const [panel, setPanel] = useState(false);

  const list = useMemo(() => {
    const out = PRODUCTS.filter(
      (p) =>
        matchCat(p, cat, season.id) &&
        (!q || `${p.name} ${p.type} ${p.description}`.toLowerCase().includes(q)) &&
        p.price <= maxPrice &&
        (!sizes.length || p.sizes.some((s) => sizes.includes(s))) &&
        (!colors.length || p.colors.some((c) => colors.includes(c.name))) &&
        (!types.length || types.includes(p.type)) &&
        (!onlyAvail || p.stock > 0)
    );
    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      asc: (a, b) => a.price - b.price,
      desc: (a, b) => b.price - a.price
    };
    return out.sort(sorters[sort]);
  }, [cat, q, season.id, maxPrice, sizes, colors, types, onlyAvail, sort]);

  const reset = () => {
    setMaxPrice(MAX_PRICE); setSizes([]); setColors([]); setTypes([]); setOnlyAvail(false);
  };

  const title = q ? `Resultados para “${params.get('q')}”` : CATEGORIES.find((c) => c.id === cat)?.label || 'Catálogo';

  return (
    <div className="page">
      <CategoryMenu active={cat} />
      <div className="cat-head">
        <div>
          <h1>{title}</h1>
          <p className="muted">{list.length} {list.length === 1 ? 'producto' : 'productos'}</p>
        </div>
        <div className="cat-tools">
          <button className="btn btn-ghost btn-sm filter-btn" onClick={() => setPanel(true)}>
            <Icon name="filter" size={18} /> Filtros
          </button>
          <label className="select">
            <span className="sr">Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Más populares</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>
      </div>

      <div className="cat-layout">
        <aside className={`filters ${panel ? 'open' : ''}`}>
          <div className="filters-top">
            <h2>Filtros</h2>
            <button className="icon-btn close-filters" onClick={() => setPanel(false)} aria-label="Cerrar filtros"><Icon name="close" /></button>
          </div>

          <fieldset>
            <legend>Precio máximo</legend>
            <input type="range" min="1000" max={MAX_PRICE} step="100" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
            <p className="muted">Hasta {money(maxPrice)}</p>
          </fieldset>

          <fieldset>
            <legend>Tipo de prenda</legend>
            {TYPES.map((t) => (
              <label key={t} className="check"><input type="checkbox" checked={types.includes(t)} onChange={() => toggle(types, setTypes, t)} />{t}</label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Talla</legend>
            <div className="chips">
              {ALL_SIZES.map((s) => (
                <button key={s} type="button" className={`chip ${sizes.includes(s) ? 'on' : ''}`} onClick={() => toggle(sizes, setSizes, s)}>{s}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Color</legend>
            <div className="swatches big">
              {ALL_COLORS.map((c) => (
                <button key={c.name} type="button" className={`sw ${colors.includes(c.name) ? 'on' : ''}`} style={{ background: c.hex }} title={c.name} aria-label={c.name} aria-pressed={colors.includes(c.name)} onClick={() => toggle(colors, setColors, c.name)} />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Disponibilidad</legend>
            <label className="check"><input type="checkbox" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} />Solo disponibles</label>
          </fieldset>

          <button className="btn btn-ghost btn-block" onClick={reset}>Limpiar filtros</button>
          <button className="btn btn-block apply-filters" onClick={() => setPanel(false)}>Ver {list.length} productos</button>
        </aside>
        {panel && <div className="scrim" onClick={() => setPanel(false)} />}

        <div className="cat-results">
          <ProductGrid products={list} empty="No hay productos con esos filtros. Prueba quitando alguno." />
        </div>
      </div>
    </div>
  );
}
