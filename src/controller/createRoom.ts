import { IncomingMessage } from "http";
import { clients } from "../data/clients";
import ClientsModel from "../model/clientsModel";
import { RoomsModel } from "../model/roomsModel";
import updateRooms from "./updateRooms";
import WebSocket from "ws";

const createRoom = (
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  clientID: string,
) => {
  const userID = ClientsModel.getUserID(clientID);
  if (!userID) throw new Error("userID is not found");

  const room = RoomsModel.createRoom(userID);

  ClientsModel.updateRoomID(clientID, room.id);

  updateRooms(server);
};

export default createRoom;
