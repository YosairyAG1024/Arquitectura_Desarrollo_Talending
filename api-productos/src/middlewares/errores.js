export function errores (err, req, res, next){
    console.error(err);

    if(err.number==2627){
        return res.status(409).json({msg: "Est correo se ha registrado"})
    }


    if (['ValidationError', 'CastError'].includes(err.name)) {
    return res.status(400).json({ msg: 'Error de validación' });
    }
res.status(500).json({msg: 'Error interno en el servidor'});

}