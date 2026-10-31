import amqp from "amqplib";

export const EXCHANGE = "eventos";
export const QUEUE = "notificaciones.usuario_creado";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Se suscribe a usuario.creado y llama a handler(evento) por cada mensaje. */
export async function startConsumer(url, handler, intentos = 30, pausaMs = 3000) {
  let conn;
  for (let i = 1; i <= intentos; i++) {
    try {
      conn = await amqp.connect(url);
      break;
    } catch (err) {
      console.log(`[notificaciones] RabbitMQ no disponible (${i}/${intentos}): ${err.message}`);
      await esperar(pausaMs);
    }
  }
  if (!conn) throw new Error("No se pudo conectar a RabbitMQ");

  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, "usuario.creado");

  await channel.consume(QUEUE, async (msg) => {
    if (!msg) return;
    try {
      await handler(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    } catch (err) {
      console.error("[notificaciones] Error procesando mensaje:", err.message);
      channel.nack(msg, false, false); // descartar mensaje inválido
    }
  });
  console.log(`[notificaciones] Escuchando la cola ${QUEUE}`);
}
