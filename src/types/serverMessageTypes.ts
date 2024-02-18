import { Commands, PartialRoom, UserWins } from "./types";

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
  type: "update_winners";
  data: UserWins[];
  id: 0;
}

export interface UpdateRoomServer {
  type: "update_room";
  data: PartialRoom[];
  id: 0;
}
