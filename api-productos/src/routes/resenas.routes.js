import {Router} from "express";
import * as ctrl from "../controllers/resenas.controllers.js";

const router = Router();

router.get('/', ctrl.listarResenas);
router.post('/', ctrl.crearResenas);

export default router;