import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "node:http";
import request from "supertest";
import { createGateway } from "../src/app.js";

let upstream, url, app;

beforeAll(async () => {
  // Servicio falso que devuelve quién lo atendió, la ruta recibida y el body
  upstream = http.createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ path: req.url, auth: req.headers.authorization || null, body }));
    });
  });
  await new Promise((r) => upstream.listen(0, r));
  url = `http://127.0.0.1:${upstream.address().port}`;
  app = createGateway({ authUrl: url, productosUrl: url, notificacionesUrl: url });
});

afterAll(() => upstream.close());

describe("API Gateway (integración)", () => {
  it("redirige /api/auth/* al servicio y conserva ruta y body", async () => {
    const res = await request(app).post("/api/auth/login").send({ correo: "a@a.com" });
    expect(res.status).toBe(200);
    expect(res.body.path).toBe("/api/auth/login");
    expect(JSON.parse(res.body.body)).toEqual({ correo: "a@a.com" });
  });

  it("reenvía el header Authorization a /api/productos", async () => {
    const res = await request(app).get("/api/productos").set("Authorization", "Bearer xyz");
    expect(res.body.path).toBe("/api/productos");
    expect(res.body.auth).toBe("Bearer xyz");
  });

  it("responde 404 a rutas desconocidas y 502 si el servicio está caído", async () => {
    expect((await request(app).get("/otra")).status).toBe(404);

    const caido = createGateway({
      authUrl: "http://127.0.0.1:1",
      productosUrl: "http://127.0.0.1:1",
      notificacionesUrl: "http://127.0.0.1:1",
    });
    expect((await request(caido).get("/api/auth/me")).status).toBe(502);
  });
});
