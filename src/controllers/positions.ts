import { RequestHandler } from "express";
import {
  IPosition,
  IPositionsRequest,
  IPositionsResponse,
} from "../interfaces/positionsInterfaces";
import logWithLocation from "../utils/logger";
import { getPositions } from "../services/positions";

export const positionController: RequestHandler<
  any,
  IPositionsResponse,
  IPositionsRequest
> = (req, res) => {
  logWithLocation("info", JSON.stringify(req.body));
  const requestData = req.body;
  const positions = getPositions(requestData);
  res.status(200).json(positions);
  };



