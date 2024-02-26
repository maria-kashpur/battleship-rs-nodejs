import { AttacStatus, Commands, PartialRoom, Ship, UserWins } from "./types";

export interface ReqServer {
  type: Commands.registrationUser;
  data:
    | {
        error: true;
        errorText: string;
      }
    | { name: string; index: number; error: false };
  id: 0;
}

export interface UpdateWinnersServer {
  type: Commands.updateWinners;
  data: UserWins[];
  id: 0;
}

export interface UpdateRoomServer {
  type: Commands.updateRoom;
  data: PartialRoom[];
  id: 0;
}

export interface AddUserToRoomServer {
  type: Commands.createGame;
  data: {
    idGame: number;
    idPlayer: number; //player id in the game
  };
  id: 0;
}

export interface StartGameServer {
  type: Commands.start;
  data: {
    ships: Ship[];
    currentPlayerIndex: number;
  };
  id: 0;
}

export interface TurnServer {
  type: Commands.turn;
  data: {
    currentPlayer: number;
  };
  id: 0;
}

export interface AttackFeedbackServer {
  type: Commands.attack;
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: 1 | 2 /* id of the player in the current game */;
    status: AttacStatus;
  };
  id: 0;
}

export interface FinishGameServer {
  type: Commands.finish;
  data: {
    winPlayer: 1 | 2 /* id of the player in the current game session */;
  };
  id: 0;
}
