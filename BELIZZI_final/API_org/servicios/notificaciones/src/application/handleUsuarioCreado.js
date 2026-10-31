/**
 * Caso de uso: reaccionar al evento usuario.creado.
 * Muestra un aviso en consola y guarda un registro en su propia base de datos.
 */
export function makeHandleUsuarioCreado({ notificacionRepo, logger = console }) {
  return async function handleUsuarioCreado(evento) {
    if (!evento || !evento.correo) throw new Error("Evento usuario.creado inválido");

    const mensaje = `¡Bienvenido/a ${evento.nombre}! Tu cuenta (${evento.correo}) fue creada.`;
    logger.log(`[notificaciones] Evento usuario.creado recibido -> ${mensaje}`);

    return notificacionRepo.create({
      tipo: "usuario.creado",
      mensaje,
      datos: evento,
    });
  };
}
