import { IncomingMessage } from "http";
import { clients } from "../data/clients";
import ClientsModel from "../model/clientsModel";
import GamesModel from "../model/gamesModel";
import { RoomsModel } from "../model/roomsModel";
import updateRooms from "./updateRooms";
import WebSocket from "ws";
import { finishGame } from "./attack";

export default function closeConnection(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  index: string,
) {
  const { roomID, gameID } = clients[index];

  if (roomID !== null) {
    RoomsModel.deleteRoom(roomID);
    updateRooms(server);
  }

  if (gameID !== null) {
    const game = GamesModel.getGamebyId(gameID);
    if (!game) return;

    const winPlayer = game.clientsKey[1] === index ? 2 : 1;

    finishGame(winPlayer, game, server);

    ClientsModel.deleteClient(index);
  }
}
