import { IncomingMessage } from "http";
import { clients } from "../data/clients";
import ClientsModel from "../model/clientsModel";
import GamesModel, { Game } from "../model/gamesModel";
import { UsersModel } from "../model/usersModel";
import { AttacClient } from "../types/clientMessageTypes";
import { AttackFeedbackServer, FinishGameServer } from "../types/serverMessageTypes";
import { Commands } from "../types/types";
import { Coordinates } from "../utils/field";
import {
  convertServerMessage,
  sendServerMessageforClient,
} from "../utils/messageHelper";
import turn from "./turn";
import updateWinners from "./uppateWinners";
import WebSocket from "ws";

const attac = (
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  data: AttacClient["data"]
) => {
  const coondinates = { x: data.x, y: data.y };
  const game = GamesModel.getGamebyId(data.gameId);
  if (!game) throw new Error("game is not found");

  if (data.indexPlayer !== game.getCurrentPlayer()) return;

  game.attac(coondinates, feedBackAttacMessage);

  const isFinish = game.isFinish();

  if (isFinish) {
    const winner = game.getWinner();
    finishGame(winner, game, server);
  } else {
    turn(server, game);
  }
};

function feedBackAttacMessage(
  game: Game,
  data: AttackFeedbackServer["data"],
) {

  const message: AttackFeedbackServer = {
    type: Commands.attack,
    data,
    id: 0,
  };

  sendServerMessageforClient(game.clientsKey[1], convertServerMessage(message));
  sendServerMessageforClient(game.clientsKey[2], convertServerMessage(message));
}

function finishGame(
  winPlayer: 1 | 2,
  game: Game,
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>
) {
  const message: FinishGameServer = {
    type: Commands.finish,
    data: {
      winPlayer,
    },
    id: 0,
  };

  const gameID = game.id;
  const client1 = game.clientsKey[1];
  const client2 = game.clientsKey[2];

  sendServerMessageforClient(client1, convertServerMessage(message));
  sendServerMessageforClient(client2, convertServerMessage(message));

  const winnerIdClient = game.clientsKey[winPlayer];
  const winnerIdUser = ClientsModel.getUserID(winnerIdClient);
  if (!winnerIdUser) return;
  UsersModel.updateWins(winnerIdUser);
  updateWinners(server);

  ClientsModel.resetGameId(client1);
  ClientsModel.resetGameId(client2);
  GamesModel.deleteGame(gameID)
}




export default attac;
