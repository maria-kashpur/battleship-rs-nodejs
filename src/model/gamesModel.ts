import counter from "../utils/counter";
import { games } from "../data/data";
import { Ship, User } from "../types/types";
import Field, { TypeGroupCells } from "../utils/field";
import { StartGameServer } from "../types/serverMessageTypes";

export class Game {
  id: number;
  usersID: {
    1: number;
    2: number;
  };
  private currentPlayer: 1 | 2;
  private currentRival: 1 | 2;
  private fieldSize: { w: number; h: number };
  private shipCount: number;
  players: {
    1: {
      field: Field;
      attac: Field;
      ships: null | Ship[];
    };
    2: {
      field: Field;
      attac: Field;
      ships: null | Ship[];
    };
  };

  constructor(idGame: number, idCreator: User["id"], idRival: User["id"]) {
    this.fieldSize = { w: 10, h: 10 };
    this.shipCount = 10;
    this.id = idGame;
    this.currentPlayer = 1;
    this.currentRival = 2;
    this.usersID = {
      1: idCreator,
      2: idRival,
    };

    this.players = {
      1: {
        field: new Field(this.fieldSize),
        attac: new Field(this.fieldSize),
        ships: null,
      },
      2: {
        field: new Field(this.fieldSize),
        attac: new Field(this.fieldSize),
        ships: [],
      },
    };
  }

  addShips(
    playerId: 1 | 2,
    ships: Ship[]
  ): { data: StartGameServer["data"]; userID: number }[] | null {
    this.players[playerId].ships = ships;
    ships.forEach((ship) => {
      const { length, position } = ship;
      const type =
        ship.direction === false
          ? TypeGroupCells.horizontal
          : TypeGroupCells.vertical;
      const coondinatesShip = Field.getGroupCells(position, length, type);
      coondinatesShip.forEach((el, i) => {
        this.players[playerId].field.fillCell(el, {
          sectors: coondinatesShip,
          targetSector: el,
          firstSector: position,
          length,
          prev: i === 0 ? null : coondinatesShip[i - 1],
          next:
            i === coondinatesShip.length - 1 ? null : coondinatesShip[i + 1],
        });
      });
    });
    return this.startGame();
  }

  private startGame():
    | { data: StartGameServer["data"]; userID: number }[]
    | null {
    if (this.players[1].ships === null || this.players[2].ships === null) {
      return null;
    }

    const result = [
      {
        data: { ships: this.players[1].ships, currentPlayerIndex: 1 },
        userID: this.usersID[1],
      },
      {
        data: { ships: this.players[2].ships, currentPlayerIndex: 2 },
        userID: this.usersID[2],
      },
    ];

    return result;
  }

  isStartGame() {
    return this.players[1].field === null || this.players[2].field === null
      ? false
      : true;
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
}

export default class GamesModel {
  private static generateGameID = counter();

  static createGame(idCreactor: number, idRival: number) {
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
