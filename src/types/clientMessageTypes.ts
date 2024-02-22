import { Commands, Ship } from "./types";

export interface ReqClient {
  type: Commands.registrationUser;
  data: {
    name: string;
    password: string;
  };
  id: 0;
}

export interface CreateRoomClient {
  type: "create_room";
  data: "";
  id: 0;
}

export interface AddUserToRoomClient {
  type: "add_user_to_room";
  data: {
    indexRoom: number;
  };
  id: 0;
}

export interface PlayWithBotClient {
  type: Commands.playWithBot;
  data: "";
  id: 0;
}

export interface AddShipsToBoardClient {
  type: Commands.addShips;
  data: {
    gameId: number;
    ships: Ship[];
    indexPlayer: number /* id of the player in the current game */;
  };
  id: 0;
}

export interface AttacClient {
  type: "attack";
  data: {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number /* id of the player in the current game */;
  };
  id: 0;
}
