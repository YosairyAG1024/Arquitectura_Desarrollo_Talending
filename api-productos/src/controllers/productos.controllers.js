import {pool} from "../db/sqlserver.js";
import { productoSchema } from "../validations/productos.schema.js";

//get /api/productos
export async function listarProductos(req, res){
    const result = await pool.request().query("SELECT * FROM productos");
    res.json(result.recordset);
}

//get /api/productos/:id
export async function obtenerProductos(req, res) {
    try {
        const r = await pool.request()
            .input("id", req.params.id)
            .query("SELECT * FROM productos WHERE id = @id");
        if (!r.recordset[0]) {
            return res.status(404).json({msg: "Producto no encontrado"});
        }
        res.json(r.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Error al obtener el producto"});
    }
}
//post /api/productos
export async function crearProductos(req, res) {
    const validacion = productoSchema.safeParse({
        name: req.body.nombre,
        price: req.body.precio,
        stock: req.body.stock ?? 0
    });

    if (!validacion.success) {
        return res.status(400).json({
            msg: "Datos inválidos",
            errores: validacion.error.issues.map(error => ({
                campo: error.path[0],
                mensaje: error.message
            }))
        });
    }

    const { name, price, stock } = validacion.data;

    try {
        const r = await pool.request()
            .input("nombre", name)
            .input("precio", price)
            .input("stock", stock)
            .query(`INSERT INTO productos (nombre, precio, stock) OUTPUT INSERTED.* VALUES (@nombre, @precio, @stock)
            `);

        res.status(201).json(r.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Error al crear el producto"});
    }
}

//put /api/productos/:id
export async function actualizarProductos(req, res) {
    const validacion = productoSchema.safeParse({
        name: req.body.nombre,
        price: req.body.precio,
        stock: req.body.stock
    });

    if (!validacion.success) {
        return res.status(400).json({ msg: "Datos inválidos", errores: validacion.error.issues.map(error => ({ campo: error.path[0], mensaje: error.message}))
        });
    }

    const { name, price, stock } = validacion.data;

    try {
        const r = await pool.request()
            .input("id", req.params.id)
            .input("nombre", name)
            .input("precio", price)
            .input("stock", stock)
            .query(`UPDATE productos SET nombre = @nombre, precio = @precio, stock = @stock OUTPUT INSERTED.* WHERE id = @id`);

        if (!r.recordset[0]) {
            return res.status(404).json({msg: "Producto no encontrado" });
        }

        res.json(r.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Error al actualizar el producto"});
    }
}

//delete /api/producto/:id
export async function eliminarProductos(req, res) {
    const r = await pool.request()
        .input('id', req.params.id)
        .query('DELETE FROM productos WHERE id = @id');
    if(!r.rowsAffected[0]) {
        res.status(404).json({msg: 'Producto no encontrado'});
        return;
    }
    res.status(204).end();
}
