export function errores (err, req, res, next){
    console.error(err);
    if(['!ValidationError', 'CastError'].includes (err.name) ) {
return res.status(400).json({msg: 'Error de validacion'});
    }
res.status(500).json({msg: 'Error interno en el servidor'});

}