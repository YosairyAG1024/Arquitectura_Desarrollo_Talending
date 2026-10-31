import sql from "mssql";

const config = {
    user    : process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    port    : Number(process.env.SQL_PORT),
    server  : process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options : { trustServerCertificate: true },
};

export const pool = await sql.connect(config);