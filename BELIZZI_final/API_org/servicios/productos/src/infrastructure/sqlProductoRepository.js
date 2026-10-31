const mapear = (r) => ({
  id: r.id,
  nombre: r.nombre,
  descripcion: r.descripcion,
  precio: Number(r.precio),
  stock: r.stock,
  creadoPor: r.creado_por,
  createdAt: r.created_at,
});

const COLS = "id, nombre, descripcion, precio, stock, creado_por, created_at";

export function makeSqlProductoRepository(pool) {
  return {
    async findAll() {
      const r = await pool.request().query(`SELECT ${COLS} FROM dbo.productos ORDER BY id DESC`);
      return r.recordset.map(mapear);
    },

    async findById(id) {
      const r = await pool
        .request()
        .input("id", Number(id))
        .query(`SELECT ${COLS} FROM dbo.productos WHERE id = @id`);
      return r.recordset[0] ? mapear(r.recordset[0]) : null;
    },

    async create({ nombre, descripcion, precio, stock, creadoPor }) {
      const r = await pool
        .request()
        .input("nombre", nombre)
        .input("descripcion", descripcion)
        .input("precio", precio)
        .input("stock", stock)
        .input("creadoPor", creadoPor)
        .query(
          `INSERT INTO dbo.productos (nombre, descripcion, precio, stock, creado_por)
           OUTPUT inserted.id, inserted.nombre, inserted.descripcion, inserted.precio,
                  inserted.stock, inserted.creado_por, inserted.created_at
           VALUES (@nombre, @descripcion, @precio, @stock, @creadoPor)`
        );
      return mapear(r.recordset[0]);
    },

    async update(id, { nombre, descripcion, precio, stock }) {
      const r = await pool
        .request()
        .input("id", Number(id))
        .input("nombre", nombre)
        .input("descripcion", descripcion)
        .input("precio", precio)
        .input("stock", stock)
        .query(
          `UPDATE dbo.productos
           SET nombre=@nombre, descripcion=@descripcion, precio=@precio, stock=@stock
           OUTPUT inserted.id, inserted.nombre, inserted.descripcion, inserted.precio,
                  inserted.stock, inserted.creado_por, inserted.created_at
           WHERE id=@id`
        );
      return mapear(r.recordset[0]);
    },

    async remove(id) {
      await pool.request().input("id", Number(id)).query("DELETE FROM dbo.productos WHERE id = @id");
    },
  };
}
