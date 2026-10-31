import { AppError } from "./errors.js";

/** Reglas de negocio de un producto. Devuelve el producto normalizado o lanza 400. */
export function validarProducto({ nombre, descripcion = "", precio, stock = 0 } = {}) {
  if (!nombre || String(nombre).trim() === "") {
    throw new AppError(400, "El nombre es obligatorio");
  }
  const p = Number(precio);
  if (precio === undefined || precio === null || precio === "" || Number.isNaN(p) || p < 0) {
    throw new AppError(400, "El precio debe ser un número mayor o igual a 0");
  }
  const s = Number(stock);
  if (!Number.isInteger(s) || s < 0) {
    throw new AppError(400, "El stock debe ser un entero mayor o igual a 0");
  }
  return { nombre: String(nombre).trim(), descripcion: String(descripcion), precio: p, stock: s };
}

export function validarResena({ calificacion, comentario = "" } = {}) {
  const c = Number(calificacion);
  if (!Number.isInteger(c) || c < 1 || c > 5) {
    throw new AppError(400, "La calificación debe ser un entero entre 1 y 5");
  }
  return { calificacion: c, comentario: String(comentario) };
}
