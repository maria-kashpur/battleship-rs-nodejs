import counter from "../utils/counter";
import { games } from "../data/data";
import { AttacStatus, Ship } from "../types/types";
import Field, {
  Coordinates,
  TypeGroupCells,
  TypeNeighboringCell,
} from "../utils/field";
import {
  AttackFeedbackServer,
  TurnServer,
} from "../types/serverMessageTypes";
import shipsPositions from "../data/shipsPositions";
import getRandomIntInclusive from "../utils/getRandomIntInclusive";

interface ResultAtac {
  feedBackAttac: AttackFeedbackServer["data"][];
  turn: TurnServer["data"];
}

interface ShipSector {
  sectors: Coordinates[];
  targetSector: Coordinates;
  length: number;
  type: TypeGroupCells;
}

export class Game {
  id: number;
  clientsKey: {
    1: string;
    2: string;
  };
  private currentPlayer: 1 | 2;
  private currentRival: 1 | 2;
  private fieldSize: { w: number; h: number };
  players: {
    1: {
      field: Field;
      attac: Field;
      ships: null | Ship[];
      shipsLeft: number;
    };
    2: {
      field: Field;
      attac: Field;
      ships: null | Ship[];
      shipsLeft: number;
    };
  };

  constructor(idGame: number, keyCreator: string, keyRival: string) {
    this.fieldSize = { w: 10, h: 10 };
    this.id = idGame;
    this.currentPlayer = 1;
    this.currentRival = 2;
    this.clientsKey = {
      1: keyCreator,
      2: keyRival,
    };

    this.players = {
      1: {
        field: new Field(this.fieldSize),
        attac: new Field(this.fieldSize),
        ships: null,
        shipsLeft: 0,
      },
      2: {
        field: new Field(this.fieldSize),
        attac: new Field(this.fieldSize),
        ships: null,
        shipsLeft: 0,
      },
    };
  }

  addShips(playerId: 1 | 2, ships: Ship[]): void {
    this.players[playerId].ships = ships;
    this.players[playerId].shipsLeft = ships.length;
    ships.forEach((ship) => {
      const { length, position } = ship;

      const type =
        ship.direction === false
          ? TypeGroupCells.horizontal
          : TypeGroupCells.vertical;

      const coondinatesShip = Field.getGroupCells(position, length, type);

      coondinatesShip.forEach((el, i) => {
        const shipSectorData: ShipSector = {
          sectors: coondinatesShip,
          targetSector: el,
          length,
          type,
        };

        this.players[playerId].field.fillCell(el, shipSectorData);
      });

      if (this.clientsKey[2] === "bot" && this.players[2].ships === null) {
        this.addShipsBot();
      }
    });
  }

  isStartGame(): Boolean {
    return this.players[1].ships !== null && this.players[2].ships !== null;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  isCurrentPlayer(indexPlayer: 1 | 2) {
    return indexPlayer !== this.currentPlayer;
  }

  chageCurrentPlayer() {
    if (this.currentPlayer === 1) {
      this.currentPlayer = 2;
      this.currentRival = 1;
    } else {
      this.currentPlayer = 1;
      this.currentRival = 2;
    }
  }

  getRivalCell(position: Coordinates) {
    return this.players[this.currentRival].field.getCellValue(position);
  }

  attac(
    position: Coordinates,
    callback: (game: Game, data: AttackFeedbackServer["data"]) => void
  ) {
    if (this.players[this.currentPlayer].attac.getCellValue(position) !== null)
      return;

    const target = this.getRivalCell(position);

    if (target === null) {
      this.missAttac(position, callback);
      this.chageCurrentPlayer();
    } else {
      const { sectors, length } = target as ShipSector;
      this.players[this.currentPlayer].attac.fillCell(position, length);
      const shipSectors =
        this.players[this.currentPlayer].attac.getCellsValue(sectors);

      const isKilled =
        shipSectors.filter((sector) => sector !== null).length === length;

      isKilled
        ? this.killedAttack(target as ShipSector, callback)
        : this.shotAttac(
            target as ShipSector,
            shipSectors as (null | number)[],
            callback
          );
    }
  }

  missAttac(
    position: Coordinates,
    callback: (game: Game, data: AttackFeedbackServer["data"]) => void
  ) {
    if (this.players[this.currentPlayer].attac.getCellValue(position) === 0) {
      return;
    }

    this.players[this.currentPlayer].attac.fillCell(position, 0);

    const data = {
      position,
      currentPlayer: this.currentPlayer,
      status: AttacStatus.miss,
    };
    callback(this, data);
  }

  shotAttac(
    target: ShipSector,
    shipSectors: (null | number)[],
    callback: (game: Game, data: AttackFeedbackServer["data"]) => void
  ) {
    const data = {
      position: target.targetSector,
      currentPlayer: this.currentPlayer,
      status: AttacStatus.shot,
    };
    callback(this, data);

    const borderCells = shipSectors.reduce(
      (acc: Coordinates[], sector, i, arr) => {
        const isMiss = typeof sector === "number";
        const isMissNext = typeof arr[i + 1] === "number";
        const isMissPrev = typeof arr[i - 1] === "number";
        const borderTipe =
          target.type === TypeGroupCells.horizontal
            ? TypeNeighboringCell.vertical
            : TypeNeighboringCell.horizontal;
        const borderCell = this.players[
          this.currentPlayer
        ].attac.getNeighborsForCell(target.sectors[i], borderTipe);

        if (i === 0 && isMiss && isMissNext) {
          acc.push(...borderCell);
        } else if (i === arr.length - 1 && isMiss && isMissPrev) {
          acc.push(...borderCell);
        } else if (isMiss && (isMissPrev || isMissNext)) {
          acc.push(...borderCell);
        }
        return acc;
      },
      []
    );

    borderCells.forEach((cell) => {
      this.missAttac(cell, callback);
    });
  }

  killedAttack(
    target: ShipSector,
    callback: (game: Game, data: AttackFeedbackServer["data"]) => void
  ) {
    target.sectors.forEach((position) => {
      const data = {
        position,
        currentPlayer: this.currentPlayer,
        status: AttacStatus.killed,
      };
      callback(this, data);
    });

    const borderShip = this.players[
      this.currentRival
    ].field.getNeighborsForCells(target.sectors, target.type);

    borderShip.forEach((cell) => {
      this.missAttac(cell, callback);
    });

    this.players[this.currentRival].shipsLeft =
      this.players[this.currentRival].shipsLeft - 1;
  }

  isFinish() {
    return this.players[this.currentRival].shipsLeft === 0;
  }

  getWinner() {
    if (this.players[1].shipsLeft === 0) {
      return 2;
    } else if (this.players[2].shipsLeft === 0) {
      return 1;
    }
    throw new Error("game is not finish");
  }

  // добавить потом рамдомный выбор поля
  addShipsBot() {
    const shipsBot = shipsPositions[0];
    this.addShips(2, shipsBot);
  }

  randomAttac(): Coordinates {
    const isSuccessfully = getRandomIntInclusive(0, 1) === 0 ? false : true;
    let coondinates = isSuccessfully ? this.successfullyRandomAttac() : this.failRandomAttac();
    
    if (coondinates.length === 0) {
      coondinates = this.successfullyRandomAttac();
    }

    return coondinates[getRandomIntInclusive(0, coondinates.length - 1)];
  }

  private successfullyRandomAttac(): Coordinates[] {
    return this.players[this.currentRival].field
      .getAllCoordinatesWithoutValue(null)
      .filter((sector) => {
        const statusSector =
          this.players[this.currentPlayer].attac.getCellValue(sector);
        if (statusSector === null) return sector;
      });
  }

  private failRandomAttac(): Coordinates[] {
    return this.players[this.currentRival].field
        .getAllCoordinatesWithValue(null)
        .filter((sector) => {
          const statusSector =
            this.players[this.currentPlayer].attac.getCellValue(sector);
          if (statusSector === null) return sector;
        });
  }
}

export default class GamesModel {
  private static generateGameID = counter();

  static createGame(idCreactor: string, idRival: string) {
    const id = this.generateGameID();
    const game = new Game(id, idCreactor, idRival);
    games.push(game);
    return game;
  }

  static getGamebyId(id: Game["id"]): Game | null {
    const game = games.find((el) => el.id === id);
    return game ? game : null;
  }

  static deleteGame(id: Game["id"]) {
    const indexGameData = games.findIndex((game) => game.id === id);
    if (indexGameData === -1) {
      return false;
    }
    games.splice(indexGameData, 1);
    return true;
  }
}
