import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

/** Muestra lo que el servicio de notificaciones guardó al consumir usuario.creado (RabbitMQ). */
export default function Notificaciones() {
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["notificaciones"],
    queryFn: () => api("/notificaciones"),
  });

  return (
    <div>
      <h2>Notificaciones (evento usuario.creado)</h2>
      <button onClick={() => refetch()}>Actualizar</button>
      {isLoading && <p>Cargando...</p>}
      <ul className="lista">
        {data.map((n) => (
          <li key={n.id} className="card">
            <div>
              <strong>{n.tipo}</strong>
              <div>{n.mensaje}</div>
              <div className="muted">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          </li>
        ))}
        {!isLoading && data.length === 0 && <li className="muted">Sin notificaciones todavía.</li>}
      </ul>
    </div>
  );
}
