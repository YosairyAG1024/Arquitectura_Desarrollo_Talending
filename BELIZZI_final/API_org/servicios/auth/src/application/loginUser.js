import { AppError } from "../domain/errors.js";

export function makeLoginUser({ userRepo, hasher, tokenService }) {
  return async function loginUser({ correo, password } = {}) {
    if (!correo || !password) {
      throw new AppError(400, "Por favor, complete todos los campos");
    }
    const user = await userRepo.findByEmail(correo);
    const ok = user && (await hasher.compare(password, user.passwordHash));
    if (!ok) throw new AppError(401, "Credenciales inválidas");

    const token = tokenService.sign({ id: user.id, nombre: user.nombre });
    return { token, nombre: user.nombre };
  };
}
