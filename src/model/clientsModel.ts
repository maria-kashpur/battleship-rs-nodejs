import { clients } from "../data/clients";
import { Game, Room } from "../types/types";
import counter from "../utils/counter";
import WebSocket from "ws";

export class Client {
  ws: WebSocket;
  userID: null | number;
  room: null | Room;
  game: null | Game;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.userID = null;
    this.room = null;
    this.game = null;
  }

  updateUserID(id: number) {
    this.userID = id;
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

  static updateUserID(index: number) {
    if (!(`${index}` in clients)) return;
    clients[index].updateUserID(index);
  }

  static deleteClient(id: string) {
    delete clients[id];
  }
}
