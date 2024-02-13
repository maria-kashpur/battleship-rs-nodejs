export const enum Commands {
  registrationPlayer = "reg",
  updateWinners = "update_winners",
  createRoom = "create_room",
  addUser = "add_user_to_room",
  createGame = "create_game",
  updateRoom = "update_room",
  addShips = "add_ships",
  start = "start_game",
  attack = "attack",
  randomAttack = "randomAttack",
  turn = "turn",
  finish = "finish",
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}
export interface PlayerLoginReq {
  type: Commands.registrationPlayer;
  data: {
    name: string;
    password: string;
  };
  id: 0;
}

export interface PlayerLoginRes {
  type: Commands.registrationPlayer;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: 0;
}

export interface UpdateWinnersRes {
  type: "update_winners";
  data: [
    {
      name: string;
      wins: number;
    },
  ];
  id: 0;
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

//Обновить состояние комнаты (отправить список комнат, в которых находится только один игрок)
export interface UpdateRoomStateRes {
  type: "update_room";
  data: [
    {
      roomId: number;
      roomUsers: [
        {
          name: string;
          index: number;
        },
      ];
    },
  ];
  id: 0;
}

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
