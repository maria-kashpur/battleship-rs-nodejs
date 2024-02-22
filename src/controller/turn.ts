import { IncomingMessage } from "http";
import { Game } from "../model/gamesModel";
import { TurnServer } from "../types/serverMessageTypes";
import { Commands } from "../types/types";
import {
  convertServerMessage,
  sendServerMessageforClient,
} from "../utils/messageHelper";
import randomAttac from "./randomAttac";
import WebSocket from "ws";

function turn(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  game: Game,
) {
  const message: TurnServer = {
    type: Commands.turn,
    data: {
      currentPlayer: game.getCurrentPlayer(),
    },
    id: 0,
  };

  sendServerMessageforClient(game.clientsKey[1], convertServerMessage(message));
  sendServerMessageforClient(game.clientsKey[2], convertServerMessage(message));

  if (game.clientsKey[2] === "bot" && message.data.currentPlayer === 2) {
    setTimeout(() => botAttack(server, game), 2000);
  }
}

export default turn;

function botAttack(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  game: Game,
) {
  const data = {
    gameId: game.id,
    indexPlayer: 2,
  };

  randomAttac(server, data);
}
