import { createApp } from "./http/app.js";
import { makeRegisterUser } from "./application/registerUser.js";
import { makeLoginUser } from "./application/loginUser.js";
import { bcryptHasher } from "./infrastructure/bcryptHasher.js";
import { makeTokenService } from "./infrastructure/jwtTokenService.js";
import { initDatabase } from "./infrastructure/sqlserver.js";
import { makeSqlUserRepository } from "./infrastructure/sqlUserRepository.js";
import { createRabbitPublisher } from "./infrastructure/rabbitPublisher.js";

const port = Number(process.env.PORT || 3001);

const pool = await initDatabase();
const publisher = await createRabbitPublisher(process.env.RABBITMQ_URL);

const userRepo = makeSqlUserRepository(pool);
const tokenService = makeTokenService(process.env.JWT_SECRET);
const hasher = bcryptHasher;

const app = createApp({
  registerUser: makeRegisterUser({ userRepo, hasher, publisher }),
  loginUser: makeLoginUser({ userRepo, hasher, tokenService }),
  tokenService,
});

app.listen(port, () => console.log(`[auth] Escuchando en el puerto ${port}`));
