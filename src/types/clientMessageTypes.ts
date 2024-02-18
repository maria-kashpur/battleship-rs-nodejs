import { Commands } from "./types";

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

export interface PlayWithBot {
  type: Commands.playWithBot;
  data: "";
  id: 0;
}
