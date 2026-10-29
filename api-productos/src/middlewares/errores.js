
export function errores(err, req, res, next) {
    console.error(err);

    // 409: conflicto por un dato duplicado en SQL Server
    if (err.number === 2627 || err.number === 2601) {
        return res.status(409).json({
            msg: "Este dato ya está registrado"
        });
    }

    // 400: error de validación de datos
    if (["ValidationError", "CastError"].includes(err.name)) {
        return res.status(400).json({
            msg: "Error de validación"
        });
    }

    // 500: cualquier otro error no controlado
    return res.status(500).json({
        msg: "Error interno en el servidor"
    });
}
