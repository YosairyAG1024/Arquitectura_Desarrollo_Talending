import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/products.js';

export default function CategoryMenu({ active }) {
  return (
    <nav className="catmenu" aria-label="Categorías">
      {CATEGORIES.map((c) => (
        <Link
          key={c.id}
          to={c.id === 'todo' ? '/catalogo' : `/catalogo?cat=${c.id}`}
          className={active === c.id ? 'on' : ''}
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
