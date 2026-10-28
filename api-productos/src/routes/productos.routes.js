import { Router } from "express";
import * as ctrl from "../controllers/productos.controllers.js"
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

//publicas
router.get('/', ctrl.listarProductos);
router.get('/:id', ctrl.obtenerProductos);

//privadas
router.post('/', verificarToken, ctrl.crearProductos);
router.put('/:id', verificarToken, ctrl.actualizarProductos);
router.delete('/:id', verificarToken, ctrl.eliminarProductos);

export default router;



