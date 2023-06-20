import { Router } from "express";
import { positionController } from "../controllers/positions";
import { validateRequestData } from "../middleware/validation";

const positionsRouter = Router();

positionsRouter.post("/", validateRequestData, positionController);

export default positionsRouter;