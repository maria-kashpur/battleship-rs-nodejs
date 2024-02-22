import { IncomingMessage } from "http";
import ClientsModel from "../model/clientsModel";
import GamesModel, { Game } from "../model/gamesModel";
import { RoomsModel } from "../model/roomsModel";
import { AddUserToRoomClient } from "../types/clientMessageTypes";
import { AddUserToRoomServer } from "../types/serverMessageTypes";
import { Commands } from "../types/types";
import {
  convertServerMessage,
  sendServerMessageforClient,
} from "../utils/messageHelper";
import WebSocket from "ws";
import updateRooms from "./updateRooms";

const createGame = (
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  clientKeyRival: string,
  { indexRoom }: AddUserToRoomClient["data"],
) => {
  const clientKeyCreator = ClientsModel.getClientKeyByRoomId(indexRoom);
  if (!clientKeyCreator) throw new Error("client is not found");

  if (!isValidUsers(clientKeyCreator, clientKeyRival)) return;

  const game = GamesModel.createGame(clientKeyCreator, clientKeyRival);
  ClientsModel.updateGameID(clientKeyRival, game.id);
  ClientsModel.updateGameID(clientKeyCreator, game.id);

  deleteRoom(server, clientKeyCreator);
  addUserToRoom(game.id, 1, clientKeyCreator);
  addUserToRoom(game.id, 2, clientKeyRival);
};

function addUserToRoom(idGame: Game["id"], idPlayer: 1 | 2, clientKey: string) {
  const message: AddUserToRoomServer = {
    type: Commands.createGame,
    data: {
      idGame,
      idPlayer,
    },
    id: 0,
  };

  sendServerMessageforClient(clientKey, convertServerMessage(message));
}

function deleteRoom(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  clientKey: string,
) {
  const roomID = ClientsModel.getRoomID(clientKey);
  if (roomID === null) throw new Error("roomID is not found");

  RoomsModel.deleteRoom(roomID);
  ClientsModel.resetRoomId(clientKey);
  updateRooms(server);
}

function isValidUsers(clientKeyCreator: string, clientKeyRival: string) {
  const userIDCreator = ClientsModel.getUserID(clientKeyCreator);
  const userIDRival = ClientsModel.getUserID(clientKeyRival);
  return userIDCreator !== userIDRival;
}

export default createGame;
