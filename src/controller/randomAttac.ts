import { IncomingMessage } from "http";
import { randomAttac } from "../types/clientMessageTypes";
import WebSocket from "ws";
import GamesModel from "../model/gamesModel";
import attac from "./attack";

const randomAttac = (
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  { gameId, indexPlayer }: randomAttac["data"]
) => {
    const game = GamesModel.getGamebyId(gameId);
    if (!game) throw new Error("game is not found");

    if (indexPlayer !== game.getCurrentPlayer()) return;

    const coondinates = game.randomAttac()
    const data = {
      gameId,
      x: coondinates.x,
      y: coondinates.y,
      indexPlayer
    }
    attac(server, data)
};

export default randomAttac;