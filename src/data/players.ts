import { Ship } from "../types/types";

export interface Player {
  name: string;
  password: string;
  wins: number;
  index: number;
  room: null | Room["roomID"];
  indexInGame: false | 1 | 2;
}

export const Players: Player[] | [] = [];

export interface Room {
  roomID: number;
  indexRoom: number;
  idGame: number;
  idPlayer: number;
  state: 1 | 2;
}

export const Rooms: Room[] | [] = [];

export interface Game {
  currentPlayerIndex: 1 | 2;
  gameId: number;
  shipsPosition1: Ship[];
  shipsPosition2: Ship[];
  winPlayer: number;
  attack:
    | {
        x: number;
        y: number;
        status: "miss" | "killed" | "shot";
        playerID: 1 | 2;
      }[]
    | [];
}

export const Games: Game[] | [] = [];
