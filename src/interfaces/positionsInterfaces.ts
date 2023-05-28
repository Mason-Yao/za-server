export interface IPositionsRequest {
  gridSize: number;
  zombie: IPosition;
  creatures: IPosition[];
  commands: string;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IPositionsResponse {
  zombies: IPosition[];
  creatures: IPosition[];
}