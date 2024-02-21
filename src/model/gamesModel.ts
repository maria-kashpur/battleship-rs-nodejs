import counter from "../utils/counter";
import { games } from "../data/data";
import { AttacStatus, Ship, User } from "../types/types";
import Field, { Coordinates, TypeGroupCells, TypeNeighboringCell } from "../utils/field";
import {
  AttackFeedbackServer,
  StartGameServer,
  TurnServer,
} from "../types/serverMessageTypes";

interface ResultAtac {
  feedBackAttac: AttackFeedbackServer["data"][];
  turn: TurnServer["data"];
}

interface ShipSector {
  sectors: Coordinates[];
  targetSector: Coordinates;
  firstSector: Coordinates;
  length: number;
  prev: Coordinates | null;
  next: Coordinates | null;
  type: TypeGroupCells;
}

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
        const shipSectorData: ShipSector = {
          sectors: coondinatesShip,
          targetSector: el,
          firstSector: position,
          length,
          prev: i === 0 ? null : coondinatesShip[i - 1],
          next:
            i === coondinatesShip.length - 1 ? null : coondinatesShip[i + 1],
          type
        };

        this.players[playerId].field.fillCell(el, shipSectorData);
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

  attac(coondinates: Coordinates, indexPlayer: 1 | 2): null | ResultAtac {


    const target = this.checkAttac(coondinates);

    if (target === null) {
      return this.shotAttac(coondinates);
    }

    return this.successfulAttac(target as ShipSector);
  }

  isCurrentPlayer(indexPlayer: 1 | 2) {
    return indexPlayer !== this.currentPlayer;
  }

  checkAttac(coondinates: Coordinates) {
    return this.players[this.currentRival].field.getCellValue(coondinates);
  }

  shotAttac(coondinates: Coordinates): ResultAtac {
    this.players[this.currentPlayer].attac.fillCell(coondinates, 0);

    const feedBackAttac = [
      {
        position: coondinates,
        currentPlayer: this.currentPlayer,
        status: AttacStatus.shot,
      },
    ];

    this.chageCurrentPlayer();

    const turn = {
      currentPlayer: this.currentPlayer,
    };

    return { feedBackAttac, turn };
  }

  successfulAttac(target: ShipSector) {
    switch (target.length) {
      case 1:
        return this.smallShipAttac(target);
      case 2:
      case 3:
      case 4:
        return this.bigShipAttac(target);
      default:
        throw new Error("unidentified ship");
    }
  }

  smallShipAttac(target: ShipSector): ResultAtac {
    this.players[this.currentPlayer].attac.fillCell(target.targetSector, 1);

    const feedBackAttac = [
      {
        position: target.targetSector,
        currentPlayer: this.currentPlayer,
        status: AttacStatus.killed,
      },
    ];

    this.players[this.currentRival].field
      .getNeighborsForCell(target.targetSector)
      .forEach((cell) => {
        this.players[this.currentPlayer].attac.fillCell(cell, 0);
        const borderShip = {
          position: cell,
          currentPlayer: this.currentPlayer,
          status: AttacStatus.shot,
        };
        feedBackAttac.push(borderShip);
      });

    const turn = {
      currentPlayer: this.currentPlayer,
    };

    return { feedBackAttac, turn };
  }

  bigShipAttac(target: ShipSector): ResultAtac {
    const {sectors, length, type, targetSector} = target

    this.players[this.currentPlayer].attac.fillCell(targetSector, length);

    const shipSectors = this.players[this.currentPlayer].attac.getCellsValue(sectors)
    const isKilled = shipSectors.filter((sector) => sector !== null).length === length;
    
    const turn = {
      currentPlayer: this.currentPlayer,
    };

    if (isKilled) {
      const feedBackAttac = [
        {
          position: targetSector,
          currentPlayer: this.currentPlayer,
          status: AttacStatus.killed,
        },
      ];

      this.players[this.currentRival].field.getNeighborsForCells(
        sectors,
        type,
      ).forEach((cell) => {
        const value = this.players[this.currentPlayer].attac.getCellValue(cell);
        if(value !== 0) {
          this.players[this.currentPlayer].attac.fillCell(cell, 0);
          const borderShip = {
            position: cell,
            currentPlayer: this.currentPlayer,
            status: AttacStatus.shot,
          };
          feedBackAttac.push(borderShip);
        }
      });

      return { feedBackAttac, turn };
    } 
    
    const feedBackAttac = [
      {
        position: target.targetSector,
        currentPlayer: this.currentPlayer,
        status: AttacStatus.miss,
      },
    ];
    
    const borderCells = shipSectors.reduce((acc: Coordinates[], sector, i, arr) => {
      const isMiss = sector !== null;
      const isMissNext = arr[i + 1] !== null;
      const isMissPrev = arr[i - 1] !== null;
      const borderTipe = type === TypeGroupCells.horizontal ? TypeNeighboringCell.vertical : TypeNeighboringCell.horizontal;
      const borderSell = this.players[
          this.currentPlayer
        ].attac.getNeighborsForCell(sectors[i], borderTipe);

      if ((i === 0 && isMiss && isMissNext) ) {
        borderSell.forEach(el => acc.push(el))
      } else if (i === (arr.length - 1) && isMissPrev) {
        borderSell.forEach((el) => acc.push(el));
      } else if (isMiss && (isMissPrev || isMissNext)) {
        borderSell.forEach((el) => acc.push(el));
      }
      return acc;
    }, [])

    borderCells.forEach(cell => {
      const value = this.players[this.currentPlayer].attac.getCellValue(cell);
      if (value !== 0) {
        this.players[this.currentPlayer].attac.fillCell(cell, 0);
        const borderShip = {
          position: cell,
          currentPlayer: this.currentPlayer,
          status: AttacStatus.shot,
        };
        feedBackAttac.push(borderShip);
      }
    })

    return { feedBackAttac, turn };
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
