export const enum Commands {
  registrationUser = "reg",
  updateWinners = "update_winners",
  createRoom = "create_room",
  playWithBot = "single_play",
  addUserToRoom = "add_user_to_room",
  createGame = "create_game",
  updateRoom = "update_room",
  addShips = "add_ships",
  start = "start_game",
  attack = "attack",
  randomAttack = "randomAttack",
  turn = "turn",
  finish = "finish",
}

export interface User {
  name: string;
  password: string;
  wins: number;
  id: number;
}

export interface Room {
  id: number;
  idGame: number | null;
  idCreactor: User["id"];
  nameCreator: string;
  idRival: User["id"] | null | "bot";
}

export interface PartialRoom {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
  }[];
}

export interface Ship {
  position: {
    x: number; // начиная с левого верхнего угла
    y: number;
  };
  direction: boolean; // false - gorisontal, true - vertive
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface NeighboringCell {
  x: number;
  y: number;
  type: "vertical" | "horizontal" | "angle";
}

export enum AttacStatus {
  miss = "miss",
  killed = "killed",
  shot = "shot",
}

//==================================

export const enum ShipLength {
  "small" = 1,
  "medium" = 2,
  "large" = 3,
  "huge" = 4,
}

export interface Attack {
  x: number;
  y: number;
  status: "miss" | "killed" | "shot"; //"промах", "убит", "ранен"..отправляемого промахом для всех ячеек вокруг корабля
}

interface ShipPos {
  x: number;
  y: number;
  hit: true | false;
}

export interface UserWins {
  name: User["name"];
  wins: User["wins"];
}

export interface RandomAttackReq {
  type: "randomAttack";
  data: {
    gameId: number;
    indexPlayer: number /* id of the player in the current game */;
  };
  id: 0;
}

export interface FinishGameRes {
  type: "finish";
  data: {
    winPlayer: number;
  };
  id: 0;
}
