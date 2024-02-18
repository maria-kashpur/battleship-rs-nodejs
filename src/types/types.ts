export const enum Commands {
  registrationUser = "reg",
  updateWinners = "update_winners",
  createRoom = "create_room",
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

//==================================
export interface Game {}

export interface NeighboringCell {
  x: number;
  y: number;
  type: "vertical" | "horizontal" | "angle";
}

export const enum ShipLength {
  "small" = 1,
  "medium" = 2,
  "large" = 3,
  "huge" = 4,
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

export interface Attack {
  x: number;
  y: number;
  status: "miss" | "killed" | "shot";
}

interface ShipPos {
  x: number;
  y: number;
  hit: true | false;
}

export interface Game {
  currentPlayerIndex: 1 | 2;
  id: number;
  winPlayer: User["id"] | null;
  players: {
    1: {
      id: User["id"];
      ships: Ship[] | null;
      attack: Attack[] | null;
      field: null | unknown[][];
    };
    2: {
      id: User["id"] | "bot";
      ships: Ship[] | null;
      attack: Attack[] | null;
      field: null | unknown[][];
    };
  };
}

export interface Ship {
  position: {
    x: number; // начиная с левого верхнего угла
    y: number;
  };
  direction: boolean; // false - gorisontal
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface UserWins {
  name: User["name"];
  wins: User["wins"];
}

// Создать новую комнату (создать игровую комнату и добавить себя туда)
export interface CreateNewRoomReq {
  type: "create_room";
  data: "";
  id: 0;
}
// Добавить пользователя в комнату (добавить себя в чью-то комнату, затем удалить комнату из списка комнат)
export interface AddUserToRoomReq {
  type: "add_user_to_room";
  data: {
    indexRoom: number;
  };
  id: 0;
}

export interface AddUserToRoomRes {
  type: "create_game";
  data: {
    idGame: number;
    idPlayer: number; //player id in the game
  };
  id: 0;
}

export interface PartialRoom {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
  }[];
}

//Обновить состояние комнаты (отправить список комнат, в которых находится только один игрок)

export interface AddShipsToBoardReq {
  type: "add_ships";
  data: {
    gameId: number;
    ships: Ship[];
    indexPlayer: number /* id of the player in the current game */;
  };
  id: 0;
}
export interface StartGameRes {
  type: "start_game";
  data: {
    ships: Ship[];
    currentPlayerIndex: number /* id of the player in the current game who have sent his ships */;
  };
  id: 0;
}

export interface AttackReq {
  type: "attack";
  data: {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number /* id of the player in the current game */;
  };
  id: 0;
}

export interface AttackFeedbackRes {
  type: "attack";
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number /* id of the player in the current game */;
    status: "miss" | "killed" | "shot";
  };
  id: 0;
}

export interface RandomAttackReq {
  type: "randomAttack";
  data: {
    gameId: number;
    indexPlayer: number /* id of the player in the current game */;
  };
  id: 0;
}

export interface InfoAboutPlayerTurnRes {
  type: "turn";
  data: {
    currentPlayer: number;
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
