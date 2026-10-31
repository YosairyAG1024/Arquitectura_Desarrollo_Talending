import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/http/app.js";
import { makeRegisterUser } from "../src/application/registerUser.js";
import { makeLoginUser } from "../src/application/loginUser.js";
import { makeTokenService } from "../src/infrastructure/jwtTokenService.js";
import { makeFakeUserRepo, fakeHasher } from "./helpers.js";

let app, publisher;

beforeEach(() => {
  const userRepo = makeFakeUserRepo();
  const tokenService = makeTokenService("secreto-de-prueba");
  publisher = { publish: vi.fn() };
  app = createApp({
    registerUser: makeRegisterUser({ userRepo, hasher: fakeHasher, publisher }),
    loginUser: makeLoginUser({ userRepo, hasher: fakeHasher, tokenService }),
    tokenService,
  });
});

const usuario = { nombre: "Ana", correo: "ana@test.com", password: "secreto1" };

describe("API de autenticación (integración con Supertest)", () => {
  it("POST /api/auth/register -> 201 y publica el evento", async () => {
    const res = await request(app).post("/api/auth/register").send(usuario);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nombre: "Ana", correo: "ana@test.com" });
    expect(res.body.passwordHash).toBeUndefined();
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });

  it("POST /api/auth/login -> 200 con token; 401 con clave incorrecta", async () => {
    await request(app).post("/api/auth/register").send(usuario);

    const ok = await request(app)
      .post("/api/auth/login")
      .send({ correo: usuario.correo, password: usuario.password });
    expect(ok.status).toBe(200);
    expect(ok.body.token).toBeTruthy();

    const mal = await request(app)
      .post("/api/auth/login")
      .send({ correo: usuario.correo, password: "otra" });
    expect(mal.status).toBe(401);
  });

  it("GET /api/auth/me (protegido) -> 401 sin token y 200 con token", async () => {
    await request(app).post("/api/auth/register").send(usuario);
    const { body } = await request(app)
      .post("/api/auth/login")
      .send({ correo: usuario.correo, password: usuario.password });

    const sin = await request(app).get("/api/auth/me");
    expect(sin.status).toBe(401);

    const con = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${body.token}`);
    expect(con.status).toBe(200);
    expect(con.body.nombre).toBe("Ana");
  });
});
