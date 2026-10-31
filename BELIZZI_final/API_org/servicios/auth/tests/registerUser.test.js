import { describe, it, expect, vi } from "vitest";
import { makeRegisterUser } from "../src/application/registerUser.js";
import { makeFakeUserRepo, fakeHasher } from "./helpers.js";

describe("caso de uso registerUser (unitaria)", () => {
  const datos = { nombre: "Ana", correo: "ana@test.com", password: "secreto1" };

  it("crea el usuario, guarda hash (no la clave) y publica usuario.creado", async () => {
    const userRepo = makeFakeUserRepo();
    const publisher = { publish: vi.fn() };
    const registerUser = makeRegisterUser({ userRepo, hasher: fakeHasher, publisher });

    const user = await registerUser(datos);

    expect(user).toEqual({ id: 1, nombre: "Ana", correo: "ana@test.com" });
    expect(userRepo.users[0].passwordHash).toBe("hash:secreto1");
    expect(publisher.publish).toHaveBeenCalledWith(
      "usuario.creado",
      expect.objectContaining({ id: 1, correo: "ana@test.com" })
    );
  });

  it("rechaza campos faltantes con 400", async () => {
    const registerUser = makeRegisterUser({
      userRepo: makeFakeUserRepo(),
      hasher: fakeHasher,
      publisher: { publish: vi.fn() },
    });
    await expect(registerUser({ nombre: "Ana" })).rejects.toMatchObject({ status: 400 });
  });

  it("rechaza correo duplicado con 409", async () => {
    const registerUser = makeRegisterUser({
      userRepo: makeFakeUserRepo(),
      hasher: fakeHasher,
      publisher: { publish: vi.fn() },
    });
    await registerUser(datos);
    await expect(registerUser(datos)).rejects.toMatchObject({ status: 409 });
  });

  it("no falla el registro si RabbitMQ está caído", async () => {
    const publisher = { publish: vi.fn().mockRejectedValue(new Error("caído")) };
    const registerUser = makeRegisterUser({
      userRepo: makeFakeUserRepo(),
      hasher: fakeHasher,
      publisher,
      logger: { error: () => {} },
    });
    await expect(registerUser(datos)).resolves.toMatchObject({ nombre: "Ana" });
  });
});
