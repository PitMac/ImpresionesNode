import { Router } from "express";
import { printFactura } from "../controllers/print.controller.js";
const router = Router();

router.post("/print/:ip/:type", printFactura);

export default router;
