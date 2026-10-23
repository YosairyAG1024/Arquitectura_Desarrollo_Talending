import routes, { Router } from "express";
import * as ctrl from "../controllers/productos.controllers.js"

const router = Router();

router.get('/', ctrl.listarProductos);
router.get('/:id', ctrl.obtenerProductos);
router.post('/', ctrl.crearProductos);
router.put('/:id', ctrl.actualizarProductos);
router.delete('/:id', ctrl.eliminarProductos);

export default router;



