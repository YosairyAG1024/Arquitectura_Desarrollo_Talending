import { AppError } from "../domain/errors.js";
import { validarProducto, validarResena } from "../domain/producto.js";

/**
 * Casos de uso del módulo de productos (arquitectura hexagonal).
 * Los puertos son productoRepo (SQL Server) y resenaRepo (MongoDB).
 */
export function makeProductoUseCases({ productoRepo, resenaRepo }) {
  const obtenerOError = async (id) => {
    const p = await productoRepo.findById(id);
    if (!p) throw new AppError(404, "Producto no encontrado");
    return p;
  };

  return {
    listar: () => productoRepo.findAll(),

    obtener: (id) => obtenerOError(id),

    crear: async (data, usuario) => {
      const valido = validarProducto(data);
      return productoRepo.create({ ...valido, creadoPor: usuario.id });
    },

    actualizar: async (id, data) => {
      await obtenerOError(id);
      return productoRepo.update(id, validarProducto(data));
    },

    eliminar: async (id) => {
      await obtenerOError(id);
      await productoRepo.remove(id);
    },

    agregarResena: async (productoId, data, usuario) => {
      await obtenerOError(productoId);
      const valida = validarResena(data);
      return resenaRepo.create({
        productoId: Number(productoId),
        usuarioId: usuario.id,
        autor: usuario.nombre,
        ...valida,
      });
    },

    listarResenas: async (productoId) => {
      await obtenerOError(productoId);
      return resenaRepo.findByProducto(Number(productoId));
    },
  };
}
