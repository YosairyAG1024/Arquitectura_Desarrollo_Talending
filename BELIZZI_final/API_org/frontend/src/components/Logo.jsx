import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="BELIZZI, ir al inicio">
      <svg viewBox="0 0 24 28" width="18" height="21" aria-hidden="true">
        <path d="M3 27V12a9 9 0 0 1 18 0v15" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 27V13a4 4 0 0 1 8 0v14" style={{ fill: "var(--accent)" }} stroke="none" />
      </svg>
      <span>BELIZZI</span>
    </Link>
  );
}
