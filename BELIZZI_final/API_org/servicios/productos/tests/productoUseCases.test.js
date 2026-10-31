import { describe, it, expect } from "vitest";
import { makeProductoUseCases } from "../src/application/productoUseCases.js";
import { makeFakeProductoRepo, makeFakeResenaRepo } from "./helpers.js";

const usuario = { id: 7, nombre: "Ana" };
const nuevo = () =>
  makeProductoUseCases({ productoRepo: makeFakeProductoRepo(), resenaRepo: makeFakeResenaRepo() });

describe("casos de uso de productos (unitarias)", () => {
  it("crea un producto normalizado y registra quién lo creó", async () => {
    const casos = nuevo();
    const p = await casos.crear({ nombre: "  Café ", precio: "12.5", stock: 3 }, usuario);
    expect(p).toMatchObject({ nombre: "Café", precio: 12.5, stock: 3, creadoPor: 7 });
  });

  it("rechaza nombre vacío y precio negativo con 400", async () => {
    const casos = nuevo();
    await expect(casos.crear({ nombre: "", precio: 1 }, usuario)).rejects.toMatchObject({ status: 400 });
    await expect(casos.crear({ nombre: "X", precio: -5 }, usuario)).rejects.toMatchObject({ status: 400 });
  });

  it("lanza 404 al obtener, actualizar o eliminar un producto inexistente", async () => {
    const casos = nuevo();
    await expect(casos.obtener(99)).rejects.toMatchObject({ status: 404 });
    await expect(casos.actualizar(99, { nombre: "x", precio: 1 })).rejects.toMatchObject({ status: 404 });
    await expect(casos.eliminar(99)).rejects.toMatchObject({ status: 404 });
  });

  it("agrega y lista reseñas validando la calificación 1-5", async () => {
    const casos = nuevo();
    const p = await casos.crear({ nombre: "Té", precio: 5 }, usuario);
    await casos.agregarResena(p.id, { calificacion: 5, comentario: "Rico" }, usuario);
    await expect(casos.agregarResena(p.id, { calificacion: 9 }, usuario)).rejects.toMatchObject({ status: 400 });
    const lista = await casos.listarResenas(p.id);
    expect(lista).toHaveLength(1);
    expect(lista[0]).toMatchObject({ autor: "Ana", calificacion: 5 });
  });
});
