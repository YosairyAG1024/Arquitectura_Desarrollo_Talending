import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";

const routes = Router();

routes.get("/health", healthCheck);

export default routes;