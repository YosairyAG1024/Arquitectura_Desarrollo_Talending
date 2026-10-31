const mapear = (row) =>
  row && {
    id: row.id,
    nombre: row.name,
    correo: row.email,
    passwordHash: row.password_hash,
  };

export function makeSqlUserRepository(pool) {
  return {
    async findByEmail(correo) {
      const r = await pool
        .request()
        .input("correo", correo)
        .query("SELECT id, name, email, password_hash FROM dbo.usuarios WHERE email = @correo");
      return mapear(r.recordset[0]) || null;
    },

    async create({ nombre, correo, passwordHash }) {
      const r = await pool
        .request()
        .input("nombre", nombre)
        .input("correo", correo)
        .input("hash", passwordHash)
        .query(
          `INSERT INTO dbo.usuarios (name, email, password_hash)
           OUTPUT inserted.id, inserted.name, inserted.email
           VALUES (@nombre, @correo, @hash)`
        );
      const row = r.recordset[0];
      return { id: row.id, nombre: row.name, correo: row.email };
    },
  };
}
