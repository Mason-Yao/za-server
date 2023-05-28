import { RequestHandler } from "express";
import {
  IPositionsRequest,
  IPositionsResponse,
} from "../interfaces/positionsInterfaces";
import logWithLocation from "../utils/logger";

const getPositions: RequestHandler<
  any,
  IPositionsResponse,
  IPositionsRequest
> = (req, res) => {
  logWithLocation("info", JSON.stringify(req.body));
  const requestData = req.body;
  console.log(requestData);
  const positions = calculatePositions(requestData);
  res.status(200).json(positions);
};

const calculatePositions = ({
  gridSize,
  zombie,
  creatures,
  commands,
}: IPositionsRequest) => {
  const initialZombie = [zombie.x, zombie.y];
  const initialCreatures = creatures.map((item) => {
    return [item.x, item.y];
  });
  const activeZombiesList = [[...initialZombie]];
  const inactiveZombiesList: number[][] = [];
  const aliveCreaturesList = [...initialCreatures];
  const moves = toMoveArray(commands);
  // const activeZombiesRoutes = [[...zombieMoves(initialZombie, moves, gridSize, 0)]];
  const zombiesRoutes: number[][][] = [];
  while (true) {
    const currentZombie = activeZombiesList.shift();
    if (!currentZombie) {
      break;
    }
    const zombieIndex = zombiesRoutes.length;
    const currentZombieRoute = zombieMoves(
      currentZombie,
      moves,
      gridSize,
      zombieIndex
    );
    inactiveZombiesList.push(currentZombie);
    zombiesRoutes.push(currentZombieRoute);
    let steps = 1;
    let minDistance = 2 * Math.floor(gridSize / 2);
    outerLoop: for (let i = 0; i < currentZombieRoute.length; i += steps) {
      for (let j = 0; j < aliveCreaturesList.length; j++) {
        const xDistance = Math.min(
          Math.abs(aliveCreaturesList[j][0] - currentZombieRoute[i][0]),
          gridSize -
            Math.abs(aliveCreaturesList[j][0] - currentZombieRoute[i][0])
        );
        const yDistance = Math.min(
          Math.abs(aliveCreaturesList[j][1] - currentZombieRoute[i][1]),
          gridSize -
            Math.abs(aliveCreaturesList[j][1] - currentZombieRoute[i][1])
        );
        const distance = xDistance + yDistance;
        if (distance === 0) {
          const newZombie = aliveCreaturesList.splice(j, 1)[0];
          logWithLocation(
            "info",
            `Zombie ${zombieIndex} infected creature at (${newZombie[0]},${newZombie[1]})}`
          );
          activeZombiesList.push(newZombie);
        }
        minDistance = Math.min(minDistance, distance);
      }
      const stepsLeft = currentZombieRoute.length - i;
      if (stepsLeft < minDistance) {
        break outerLoop;
      } else {
        // set steps to minimum distance, at least move 1 step
        steps = Math.max(minDistance, 1);
      }
    }
  }
  const zombies = inactiveZombiesList.map((item, index) => {
    return {
      initialPosition: { x: item[0], y: item[1] },
      routes: zombiesRoutes[index].map((route) => {
        return { x: route[0], y: route[1] };
      }),
    };
  });
  return {
    zombies: zombies.map((zombie) => {
      return zombie.routes[zombie.routes.length - 1]
    }),
    creatures: aliveCreaturesList.map((route) => {
        return { x: route[0], y: route[1] };
      }),

  };
};

const zombieMoves = (
  zombie: number[],
  moves: number[][],
  gridSize: number,
  zombieIndex: number
): number[][] => {
  const route = [[...zombie]];
  let position = [...zombie];
  for (let i = 0; i < moves.length; i++) {
    const x = position[0] + moves[i][0];
    const y = position[1] + moves[i][1];
    const newPosition = [
      borderPositionTransfer(x, gridSize),
      borderPositionTransfer(y, gridSize),
    ];
    position = newPosition;
    logWithLocation(
      "info",
      `Zombie ${zombieIndex} moved to (${newPosition[0]},${newPosition[1]})`
    );
    route.push(position);
  }
  return route;
};

const borderPositionTransfer = (position: number, gridSize: number) => {
  if (position > gridSize - 1) {
    return position - gridSize;
  } else if (position < 0) {
    return position + gridSize;
  } else {
    return position;
  }
};

const toMoveArray = (commands: string) => {
  return commands.split("").map((item) => {
    switch (item) {
      case "R":
        return [1, 0];
      case "L":
        return [-1, 0];
      case "D":
        return [0, 1];
      case "U":
        return [0, -1];
      default:
        return [0, 0];
    }
  });
};
export default getPositions;
