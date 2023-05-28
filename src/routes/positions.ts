import { Router } from "express";
import getPositions from "../controllers/getPositions";
import { validateRequestData } from "../middleware/validation";

const positionsRouter = Router();

positionsRouter.post("/", validateRequestData, getPositions);

export default positionsRouter;