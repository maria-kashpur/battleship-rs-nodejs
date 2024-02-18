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
  type: Commands.updateWinners;
  data: UserWins[];
  id: 0;
}

export interface UpdateRoomServer {
  type: Commands.updateRoom;
  data: PartialRoom[];
  id: 0;
}

