import { Router } from "express";
import positionsRouter from "./positions";

const router = Router();

router.use("/positions", positionsRouter)

export default router;