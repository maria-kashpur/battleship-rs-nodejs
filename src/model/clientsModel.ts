import { clients } from "../data/clients";
import counter from "../utils/counter";
import WebSocket from "ws";
import { RoomsModel } from "./roomsModel";
import { Room, User } from "../types/types";

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

  updateRoomID(id: number | null) {
    this.roomID = id;
  }

  updateGameId(id: number | null) {
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

  static resetRoomId(idClients: string) {
    if (!(`${idClients}` in clients)) return;
    clients[idClients].updateRoomID(null);
  }

  static resetGameId(idClients: string) {
    if (!(`${idClients}` in clients)) return;
    clients[idClients].updateGameId(null);
  }

  static updateGameID(idClients: string, idGame: number) {
    if (!(`${idClients}` in clients)) return;
    clients[idClients].updateGameId(idGame);
  }

  static getUserID(idClient: string): User["id"] | null {
    if (!(`${idClient}` in clients)) return null;
    return clients[idClient].userID;
  }

  static getRoomID(idClient: string): Room["id"] | null {
    if (!(`${idClient}` in clients)) return null;
    return clients[idClient].roomID;
  }

  static getIDClientIndexesByGameandUser(
    idGame: number | null,
    idUser: number,
  ): string | null {
    for (const key in clients) {
      const client = clients[key];
      if (client.gameID === idGame && client.userID === idUser) {
        return key;
      }
    }
    return null;
  }

  static getGameID(idClient: string) {
    if (!(`${idClient}` in clients)) return null;
    return clients[idClient].gameID;
  }

  static getClientKeyByRoomId(roomID: number): string | null {
    let clientKey = null;
    for (const key in clients) {
      if (clients[key].roomID === roomID) {
        clientKey = key;
      }
    }
    return clientKey;
  }

  static deleteClient(idClient: string) {
    const roomID = clients[idClient].roomID;
    if (roomID) RoomsModel.deleteRoom(roomID);
    delete clients[idClient];
  }
}
