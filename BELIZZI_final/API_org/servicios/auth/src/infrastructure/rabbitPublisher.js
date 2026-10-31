import amqp from "amqplib";

export const EXCHANGE = "eventos";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Conecta a RabbitMQ (con reintentos) y expone publish(routingKey, payload). */
export async function createRabbitPublisher(url, intentos = 30, pausaMs = 3000) {
  let conn;
  for (let i = 1; i <= intentos; i++) {
    try {
      conn = await amqp.connect(url);
      break;
    } catch (err) {
      console.log(`[auth] RabbitMQ no disponible (${i}/${intentos}): ${err.message}`);
      await esperar(pausaMs);
    }
  }
  if (!conn) throw new Error("No se pudo conectar a RabbitMQ");

  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });
  console.log("[auth] Conectado a RabbitMQ");

  return {
    async publish(routingKey, payload) {
      channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(payload)), {
        persistent: true,
        contentType: "application/json",
      });
      console.log(`[auth] Evento publicado: ${routingKey}`, payload);
    },
    close: () => conn.close(),
  };
}
