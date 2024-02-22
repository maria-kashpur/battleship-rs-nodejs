import { Ship } from "../types/types";

const FIELD_SIZE = {
  w: 10,
  h: 10,
};

const SHIPS_COUNT = {
  huge: 1,
  large: 2,
  medium: 3,
  small: 4,
};

function shipGeneranor(length: number, count: number): Ship[] {
  return Array.from({ length: count }).map(() => {
    return {
      position: { x: 0, y: 0 },
      direction: Math.random() < 0.5,
      length,
      type:
        length === 4
          ? "huge"
          : length === 3
            ? "large"
            : length === 2
              ? "medium"
              : "small",
    };
  });
}

function generateRandomPosition(length: number): { x: number; y: number } {
  return {
    x: Math.floor(Math.random() * (FIELD_SIZE.w + 1 - length)),
    y: Math.floor(Math.random() * FIELD_SIZE.h),
  };
}

function isValidPosition(
  field: number[][],
  ship: Ship,
  x: number,
  y: number,
  isVertical: boolean,
): boolean {
  if (x < 0 || x >= FIELD_SIZE.w || y < 0 || y >= FIELD_SIZE.h) return false;

  if (isVertical) {
    if (x + ship.length > FIELD_SIZE.w) return false;
    for (let i = x - 1; i < x + ship.length + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < 10 && j >= 0 && j < 10) {
          if (field[i][j] !== 0) return false;
        }
      }
    }
  } else {
    if (y + ship.length > FIELD_SIZE.h) return false;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j < y + ship.length + 1; j++) {
        if (i >= 0 && i < FIELD_SIZE.w && j >= 0 && j < FIELD_SIZE.h) {
          if (field[i][j] !== 0) return false;
        }
      }
    }
  }

  return true;
}

function placeShip(board: number[][], ship: Ship): void {
  let { x, y } = ship.position;
  let isVertical = ship.direction;

  if (!isValidPosition(board, ship, x, y, isVertical)) {
    do {
      ship.position = generateRandomPosition(ship.length);
      x = ship.position.x;
      y = ship.position.y;
      isVertical = Math.random() < 0.5;
    } while (!isValidPosition(board, ship, x, y, isVertical));
  }

  if (isVertical) {
    for (let i = x; i < x + ship.length; i++) {
      board[i][y] = 1;
    }
  } else {
    for (let i = y; i < y + ship.length; i++) {
      board[x][i] = 1;
    }
  }
}

function generateShipPositions() {
  const ships: Ship[] = [];
  ships.push(...shipGeneranor(4, SHIPS_COUNT.huge));
  ships.push(...shipGeneranor(3, SHIPS_COUNT.large));
  ships.push(...shipGeneranor(2, SHIPS_COUNT.medium));
  ships.push(...shipGeneranor(1, SHIPS_COUNT.small));

  const field = Array.from({ length: FIELD_SIZE.h }, () =>
    Array.from({ length: FIELD_SIZE.w }).fill(0)
  );

  function placeShips(): Ship[] {
    for (const ship of ships) {
      placeShip(field as number[][], ship);
    }
    return ships;
  }
  return placeShips();
}

export default generateShipPositions;
