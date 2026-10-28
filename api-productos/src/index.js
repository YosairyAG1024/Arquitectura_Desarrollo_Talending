import express from 'express'; //para el servidor
import cors from 'cors'; 
import productos from "./routes/productos.routes.js";
import resenas from "./routes/resenas.routes.js";
import {errores} from "./middlewares/errores.js";
import mongoose from 'mongoose';
import auth from "./routes/auth.routes.js"

const app = express(); //inicializamos el servidor con app
    app.use(cors()); //la comunicacion con el API 
    app.use(express.json()); //inicializando el srvidor para acepte el valor json
    
app.get("/api/salud",(req, res)=>res.json({ ok: "Api de productos Belizzi funcionando correctamente"}));  
     app.use('/api/auth', auth); 
     app.use('/api/productos', productos);
     app.use('/api/resenas', resenas);
     app.use(errores);

     await mongoose.connect(process.env.MONGO);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});