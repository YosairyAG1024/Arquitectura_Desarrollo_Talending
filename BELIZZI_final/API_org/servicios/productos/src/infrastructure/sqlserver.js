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

async function conectarConReintentos(config, intentos = 40, pausaMs = 3000) {
  for (let i = 1; i <= intentos; i++) {
    try {
      const pool = new sql.ConnectionPool(config);
      await pool.connect();
      return pool;
    } catch (err) {
      console.log(`[productos] SQL Server no disponible (${i}/${intentos}): ${err.message}`);
      await esperar(pausaMs);
    }
  }
  throw new Error("No se pudo conectar a SQL Server");
}

export async function initDatabase(env = process.env) {
  const dbName = env.SQL_DATABASE;

  const master = await conectarConReintentos(baseConfig(env, "master"));
  await master.request().query(`IF DB_ID(N'${dbName}') IS NULL CREATE DATABASE [${dbName}]`);
  await master.close();

  const pool = await conectarConReintentos(baseConfig(env, dbName));
  await pool.request().query(`
    IF OBJECT_ID(N'dbo.productos', N'U') IS NULL
    CREATE TABLE dbo.productos (
      id          INT IDENTITY(1,1) PRIMARY KEY,
      nombre      NVARCHAR(150)  NOT NULL,
      descripcion NVARCHAR(500)  NOT NULL DEFAULT '',
      precio      DECIMAL(10,2)  NOT NULL,
      stock       INT            NOT NULL DEFAULT 0,
      creado_por  INT            NULL,
      created_at  DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
    )`);
  console.log(`[productos] Base de datos ${dbName} lista`);
  return pool;
}
