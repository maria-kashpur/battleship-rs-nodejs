import { clients } from "../data/clients";
import { Game, Room } from "../types/types";
import counter from "../utils/counter";
import WebSocket from "ws";
import { RoomsModel } from "./roomsModel";

export class Client {
  ws: WebSocket;
  userID: null | number;
  roomID: null | number;
  gameID: null | number;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.userID = null;
    this.roomID = null;
    this.gameID = null;
  }

  updateUserID(id: number) {
    this.userID = id;
  }

  updateRoomID(id: number) {
    this.roomID = id;
  }

  updateGameId (id: number) {
    this.gameID = id;
  }
}

export default class ClientsModel {
  private static getClientId = counter();

  static createClient(ws: WebSocket): string {
    const index = this.getClientId().toString();
    const client = new Client(ws);
    clients[index] = client;
    return index;
  }

  static updateUserID(idClients: string, idUser: number) {
    if (!(`${idClients}` in clients)) return;
    clients[idClients].updateUserID(idUser);
  }

  static updateRoomID(idClients: string, idRoom: number) {
    if (!(`${idClients}` in clients)) return;
    clients[idClients].updateRoomID(idRoom);
  }

  static updateGameID(idClients: string, idGame: number) {
    if (!(`${idClients}` in clients)) return;
    clients[idClients].updateGameId(idGame);
  }

  static getUserID(idClient: string) {
    if (!(`${idClient}` in clients)) return null;
    return clients[idClient].userID;
  }

  static deleteClient(idClient: string) {
    const roomID = clients[idClient].roomID;
    if (roomID) RoomsModel.deleteRoom(roomID);
    delete clients[idClient];
  }
}
