import { useState } from "react";

const VACIO = { nombre: "", descripcion: "", precio: "", stock: "0" };

export default function ProductoForm({ onSubmit, isLoading = false }) {
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState("");

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setError("El nombre es obligatorio");
    if (form.precio === "" || Number(form.precio) < 0) return setError("Ingrese un precio válido");
    setError("");
    onSubmit({ ...form, precio: Number(form.precio), stock: Number(form.stock) });
    setForm(VACIO);
  };

  return (
    <form onSubmit={enviar} className="card form">
      <h3>Nuevo producto</h3>
      <label>
        Nombre
        <input name="nombre" value={form.nombre} onChange={cambiar} />
      </label>
      <label>
        Descripción
        <input name="descripcion" value={form.descripcion} onChange={cambiar} />
      </label>
      <label>
        Precio
        <input name="precio" type="number" step="0.01" value={form.precio} onChange={cambiar} />
      </label>
      <label>
        Stock
        <input name="stock" type="number" value={form.stock} onChange={cambiar} />
      </label>
      {error && <p role="alert" className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Agregar producto"}
      </button>
    </form>
  );
}
