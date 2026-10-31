import sql from "mssql";

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function baseConfig(env, database) {
  return {
    user: env.SQL_USER,
    password: env.SQL_PASSWORD,
    server: env.SQL_SERVER,
    port: Number(env.SQL_PORT || 1433),
    database,
    options: { trustServerCertificate: true },
  };
}

/** SQL Server tarda en arrancar dentro de Docker: reintentamos. */
async function conectarConReintentos(config, intentos = 40, pausaMs = 3000) {
  for (let i = 1; i <= intentos; i++) {
    try {
      const pool = new sql.ConnectionPool(config);
      await pool.connect();
      return pool;
    } catch (err) {
      console.log(`[auth] SQL Server no disponible (${i}/${intentos}): ${err.message}`);
      await esperar(pausaMs);
    }
  }
  throw new Error("No se pudo conectar a SQL Server");
}

/** Crea la base de datos y la tabla si no existen. Devuelve el pool. */
export async function initDatabase(env = process.env) {
  const dbName = env.SQL_DATABASE;

  const master = await conectarConReintentos(baseConfig(env, "master"));
  await master.request().query(`IF DB_ID(N'${dbName}') IS NULL CREATE DATABASE [${dbName}]`);
  await master.close();

  const pool = await conectarConReintentos(baseConfig(env, dbName));
  await pool.request().query(`
    IF OBJECT_ID(N'dbo.usuarios', N'U') IS NULL
    CREATE TABLE dbo.usuarios (
      id            INT IDENTITY(1,1) PRIMARY KEY,
      name          NVARCHAR(100) NOT NULL,
      email         NVARCHAR(255) NOT NULL UNIQUE,
      password_hash NVARCHAR(100) NOT NULL,
      created_at    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
    )`);
  console.log(`[auth] Base de datos ${dbName} lista`);
  return pool;
}
