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
  console.log(requestData);
  const positions = getPositions(requestData);
  console.log(positions);
  res.status(200).json(positions);
  };



