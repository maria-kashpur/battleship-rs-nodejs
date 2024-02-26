import { IncomingMessage } from "http";
import GamesModel from "../model/gamesModel";
import { AddShipsToBoardClient } from "../types/clientMessageTypes";
import { StartGameServer } from "../types/serverMessageTypes";
import { Commands, Ship } from "../types/types";
import {
  convertServerMessage,
  sendServerMessageforClient,
} from "../utils/messageHelper";
import turn from "./turn";
import WebSocket from "ws";

const addShips = (
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  data: AddShipsToBoardClient["data"],
) => {
  const { gameId, ships, indexPlayer } = data;

  const game = GamesModel.getGamebyId(gameId);
  if (!game) throw new Error("game is not found");

  if (!(indexPlayer === 1 || indexPlayer === 2)) {
    throw new Error("invalid index player");
  }

  game.addShips(indexPlayer, ships);

  const isStart = game.isStartGame();
  if (isStart) {
    startGame(game.players[1].ships as Ship[], 1, game.clientsKey[1]);
    startGame(game.players[2].ships as Ship[], 2, game.clientsKey[2]);
    turn(server, game);
  }
};

const startGame = (
  ships: Ship[],
  currentPlayerIndex: 1 | 2,
  clientKey: string,
) => {
  const message: StartGameServer = {
    type: Commands.start,
    data: {
      ships,
      currentPlayerIndex,
    },
    id: 0,
  };

  sendServerMessageforClient(clientKey, convertServerMessage(message));
};

export default addShips;
