import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/http/app.js";

const SECRET = "secreto-de-prueba";
const repo = { findRecent: async () => [{ id: "1", tipo: "usuario.creado", mensaje: "Hola" }] };
const app = createApp({ notificacionRepo: repo, jwtSecret: SECRET });

describe("API de notificaciones (integración)", () => {
  it("GET /api/notificaciones -> 401 sin token y 200 con token", async () => {
    expect((await request(app).get("/api/notificaciones")).status).toBe(401);
    const token = jwt.sign({ id: 1 }, SECRET);
    const res = await request(app).get("/api/notificaciones").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
