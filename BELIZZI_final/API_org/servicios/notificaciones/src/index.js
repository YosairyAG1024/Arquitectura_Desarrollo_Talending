import { createApp } from "./http/app.js";
import { makeHandleUsuarioCreado } from "./application/handleUsuarioCreado.js";
import { connectMongo, mongoNotificacionRepository } from "./infrastructure/mongoNotificacionRepository.js";
import { startConsumer } from "./infrastructure/rabbitConsumer.js";

const port = Number(process.env.PORT || 3003);

await connectMongo(process.env.MONGO_URL);

const handler = makeHandleUsuarioCreado({ notificacionRepo: mongoNotificacionRepository });
await startConsumer(process.env.RABBITMQ_URL, handler);

const app = createApp({
  notificacionRepo: mongoNotificacionRepository,
  jwtSecret: process.env.JWT_SECRET,
});
app.listen(port, () => console.log(`[notificaciones] Escuchando en el puerto ${port}`));
