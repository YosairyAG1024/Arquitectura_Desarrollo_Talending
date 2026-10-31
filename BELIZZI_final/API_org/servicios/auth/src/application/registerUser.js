import { AppError } from "../domain/errors.js";

/**
 * Caso de uso: registrar un usuario.
 * Depende de puertos (userRepo, hasher, publisher), no de implementaciones concretas.
 */
export function makeRegisterUser({ userRepo, hasher, publisher, logger = console }) {
  return async function registerUser({ nombre, correo, password } = {}) {
    if (!nombre || !correo || !password) {
      throw new AppError(400, "Por favor, complete todos los campos");
    }
    if (password.length < 6) {
      throw new AppError(400, "La contraseña debe tener al menos 6 caracteres");
    }

    const existente = await userRepo.findByEmail(correo);
    if (existente) throw new AppError(409, "El correo ya está registrado");

    const passwordHash = await hasher.hash(password);
    const user = await userRepo.create({ nombre, correo, passwordHash });

    // Evento asíncrono: si RabbitMQ falla, el registro NO debe fallar.
    try {
      await publisher.publish("usuario.creado", {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        fecha: new Date().toISOString(),
      });
    } catch (err) {
      logger.error("No se pudo publicar usuario.creado:", err.message);
    }

    return user;
  };
}
