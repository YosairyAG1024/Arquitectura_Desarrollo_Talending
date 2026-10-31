import { createApp } from "./http/app.js";
import { makeProductoUseCases } from "./application/productoUseCases.js";
import { initDatabase } from "./infrastructure/sqlserver.js";
import { makeSqlProductoRepository } from "./infrastructure/sqlProductoRepository.js";
import { connectMongo, mongoResenaRepository } from "./infrastructure/mongoResenaRepository.js";

const port = Number(process.env.PORT || 3002);

const pool = await initDatabase();
await connectMongo(process.env.MONGO_URL);

const casos = makeProductoUseCases({
  productoRepo: makeSqlProductoRepository(pool),
  resenaRepo: mongoResenaRepository,
});

const app = createApp({ casos, jwtSecret: process.env.JWT_SECRET });
app.listen(port, () => console.log(`[productos] Escuchando en el puerto ${port}`));
