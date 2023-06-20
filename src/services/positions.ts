import {
  IPosition,
  IPositionsRequest,
  IPositionsResponse,
} from "../interfaces/positionsInterfaces";
import logWithLocation from "../utils/logger";

export const getPositions = (requestData: IPositionsRequest): IPositionsResponse => {
  const { gridSize, zombie, commands, creatures } = requestData;
  const moves = toMoveArray(commands);
  let activeZombieIndex = 0;
  const zombies = [new Zombie(0, zombie, moves, gridSize)];
  while (activeZombieIndex < zombies.length) {
    const activeZombie = zombies[activeZombieIndex];
    while (true) { 
      creatures.forEach((creature, index) => {
        if (
          creature.x === activeZombie.position.x &&
          creature.y === activeZombie.position.y
        ) {
          const newZombie = new Zombie(
            zombies.length,
            creatures.splice(index, 1)[0],
            moves,
            gridSize
          );
          zombies.push(newZombie);
          logWithLocation(
            "info",
            `Zombie ${activeZombieIndex} infected creature at (x: ${newZombie.position.x}, y: ${newZombie.position.y})}`
          );
        }
      })
      if (activeZombie.isCompleted) break;
      activeZombie.move();
    }
    activeZombieIndex++;
  }
  return { zombies: zombies.map((zombie) => zombie.position), creatures };
}

const toMoveArray = (commands: string) => {
  const directions = {
    R: { x: 1, y: 0 },
    L: { x: -1, y: 0 },
    D: { x: 0, y: 1 },
    U: { x: 0, y: -1 },
  };
  return commands
    .split("")
    .map((item) => directions[item as keyof typeof directions]);
};

class Zombie {
  private step = 0;
  constructor(
    private readonly index: number,
    private _position: IPosition,
    private readonly moves: IPosition[],
    private readonly gridSize: number
  ) {}
  public get position(): IPosition {
    return this._position;
  }
  public get isCompleted(): boolean {
    return this.step >= this.moves.length;
  }
  public move() {
    this._position.x =
      (this._position.x + this.moves[this.step].x + this.gridSize) %
      this.gridSize;
    this._position.y =
      (this._position.y + this.moves[this.step].y + this.gridSize) %
      this.gridSize;
    logWithLocation(
      "info",
      `Zombie ${this.index} moved to (x: ${this._position.x}, y: ${this._position.y})`
    );
    this.step++;
  }
}