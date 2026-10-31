import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import ProductoForm from "../components/ProductoForm";

export default function Productos() {
  const queryClient = useQueryClient();

  const { data: productos = [], isLoading, isError, error } = useQuery({
    queryKey: ["productos"],
    queryFn: () => api("/productos"),
  });

  const crear = useMutation({
    mutationFn: (producto) => api("/productos", { method: "POST", body: producto }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const eliminar = useMutation({
    mutationFn: (id) => api(`/productos/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  return (
    <div>
      <h2>Productos</h2>
      <ProductoForm onSubmit={(p) => crear.mutate(p)} isLoading={crear.isPending} />
      {crear.isError && <p role="alert" className="error">{crear.error.message}</p>}

      {isLoading && <p>Cargando...</p>}
      {isError && <p role="alert" className="error">{error.message}</p>}

      <ul className="lista">
        {productos.map((p) => (
          <li key={p.id} className="card">
            <div>
              <strong>{p.nombre}</strong> — ${p.precio.toFixed(2)} · stock {p.stock}
              {p.descripcion && <div className="muted">{p.descripcion}</div>}
            </div>
            <button className="danger" onClick={() => eliminar.mutate(p.id)}>
              Eliminar
            </button>
          </li>
        ))}
        {!isLoading && productos.length === 0 && <li className="muted">Aún no hay productos.</li>}
      </ul>
    </div>
  );
}
