export const healthCheck = (req, res) => {
    console.log('Me llamaron dike');
    res.json(
        { 
            ok: "Api de productos Belizzi funcionando correctamente"
        })
};