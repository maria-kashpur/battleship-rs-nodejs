import { IncomingMessage } from "http";
import WebSocket from "ws";
import GamesModel from "../model/gamesModel";
import { createGame } from "./createGame";

const playWithBot = (
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  client: string
) => {
  const game = GamesModel.createGame(client, "bot");
  createGame(game.id, 1, client);


};

export default playWithBot;
