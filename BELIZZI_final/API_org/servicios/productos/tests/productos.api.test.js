import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/http/app.js";
import { makeProductoUseCases } from "../src/application/productoUseCases.js";
import { makeFakeProductoRepo, makeFakeResenaRepo } from "./helpers.js";

const SECRET = "secreto-de-prueba";
const token = jwt.sign({ id: 1, nombre: "Ana" }, SECRET);
const auth = { Authorization: `Bearer ${token}` };
let app;

beforeEach(() => {
  const casos = makeProductoUseCases({
    productoRepo: makeFakeProductoRepo(),
    resenaRepo: makeFakeResenaRepo(),
  });
  app = createApp({ casos, jwtSecret: SECRET });
});

describe("API de productos (integración con Supertest)", () => {
  it("GET /api/productos -> 401 sin token, 401 con token inválido, 200 con token", async () => {
    expect((await request(app).get("/api/productos")).status).toBe(401);
    const malo = await request(app).get("/api/productos").set("Authorization", "Bearer basura");
    expect(malo.status).toBe(401);
    const ok = await request(app).get("/api/productos").set(auth);
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual([]);
  });

  it("POST /api/productos -> 401 sin token; 201 con token; 400 si es inválido", async () => {
    const body = { nombre: "Café", precio: 10, stock: 2 };
    expect((await request(app).post("/api/productos").send(body)).status).toBe(401);

    const creado = await request(app).post("/api/productos").set(auth).send(body);
    expect(creado.status).toBe(201);
    expect(creado.body).toMatchObject({ id: 1, nombre: "Café", creadoPor: 1 });

    const invalido = await request(app).post("/api/productos").set(auth).send({ nombre: "" });
    expect(invalido.status).toBe(400);
  });

  it("CRUD completo: PUT y DELETE", async () => {
    await request(app).post("/api/productos").set(auth).send({ nombre: "A", precio: 1 });

    const put = await request(app).put("/api/productos/1").set(auth).send({ nombre: "B", precio: 2 });
    expect(put.status).toBe(200);
    expect(put.body.nombre).toBe("B");

    expect((await request(app).delete("/api/productos/1").set(auth)).status).toBe(204);
    expect((await request(app).get("/api/productos/1").set(auth)).status).toBe(404);
  });

  it("POST y GET /api/productos/:id/resenas", async () => {
    await request(app).post("/api/productos").set(auth).send({ nombre: "A", precio: 1 });
    const r = await request(app)
      .post("/api/productos/1/resenas")
      .set(auth)
      .send({ calificacion: 4, comentario: "Bien" });
    expect(r.status).toBe(201);
    const lista = await request(app).get("/api/productos/1/resenas").set(auth);
    expect(lista.body).toHaveLength(1);
  });
});
