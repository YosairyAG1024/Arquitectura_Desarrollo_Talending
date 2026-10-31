import { SEASONS } from '../data/seasons.js';
import { useShop } from '../context/ShopContext.jsx';

const OPTIONS = [{ id: 'auto', name: 'Automático' }, ...Object.values(SEASONS)];

export default function SeasonSwitcher() {
  const { seasonMode, changeSeason } = useShop();
  return (
    <div className="season-switch" role="group" aria-label="Cambiar temporada">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`ss-btn ss-${o.id} ${seasonMode === o.id ? 'on' : ''}`}
          onClick={(e) => changeSeason(o.id, { x: e.clientX, y: e.clientY })}
          aria-pressed={seasonMode === o.id}
          title={o.name}
        >
          <i />
          <span>{o.name}</span>
        </button>
      ))}
    </div>
  );
}
