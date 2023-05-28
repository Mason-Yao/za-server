import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateRequestData = (req: Request, res: Response, next: NextFunction) => {
  const { gridSize } = req.body;
  const schema = Joi.object({
    gridSize: Joi.number().required().max(14).min(2),
    zombie: Joi.object({
      x: Joi.number().required().min(0).max(gridSize - 1),
      y: Joi.number().required().min(0).max(gridSize - 1),
    }).required(),
    creatures: Joi
      .array()
      .max(12)
      .items(
        Joi.object({
          x: Joi.number().required().min(0).max(gridSize - 1),
          y: Joi.number().required().min(0).max(gridSize - 1),
        })
      )
      .required(),
    commands: Joi.string().required().min(1).max(30).regex(/^[LRDU]+$/),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: "Invalid game data, please check your inputs" });
  } else {
    next();
  }
}