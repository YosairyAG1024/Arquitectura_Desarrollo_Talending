import { describe, it, expect, vi } from "vitest";
import { makeHandleUsuarioCreado } from "../src/application/handleUsuarioCreado.js";

describe("caso de uso handleUsuarioCreado (unitaria)", () => {
  it("guarda una notificación y avisa por consola", async () => {
    const notificacionRepo = { create: vi.fn(async (d) => ({ id: "1", ...d })) };
    const logger = { log: vi.fn() };
    const handle = makeHandleUsuarioCreado({ notificacionRepo, logger });

    const r = await handle({ id: 1, nombre: "Ana", correo: "ana@test.com" });

    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining("ana@test.com"));
    expect(notificacionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: "usuario.creado", mensaje: expect.stringContaining("Ana") })
    );
    expect(r.id).toBe("1");
  });

  it("rechaza un evento inválido", async () => {
    const handle = makeHandleUsuarioCreado({ notificacionRepo: { create: vi.fn() }, logger: { log() {} } });
    await expect(handle({})).rejects.toThrow();
  });
});
