import { clients } from "../data/clients";
import GamesModel, { Game } from "../model/gamesModel";
import { AttacClient } from "../types/clientMessageTypes";
import { AttackFeedbackServer, FinishGameServer } from "../types/serverMessageTypes";
import { Commands } from "../types/types";
import { Coordinates } from "../utils/field";
import {
  convertServerMessage,
  sendServerMessageforClient,
} from "../utils/messageHelper";
import turn from "./turn";

const attac = (data: AttacClient["data"]) => {
  const coondinates = { x: data.x, y: data.y };
  const game = GamesModel.getGamebyId(data.gameId);
  if (!game) throw new Error("game is not found");

  if (data.indexPlayer !== game.getCurrentPlayer()) return;

  game.attac(coondinates, feedBackAttacMessage);

  const isFinish = game.isFinish();

  if (isFinish) {
    const winner = game.getWinner();
    finishGame(winner, game);
  } else {
    turn(game)
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

function finishGame(winPlayer: 1 | 2, game: Game) {
  const message: FinishGameServer = {
    type: Commands.finish,
    data: {
      winPlayer,
    },
    id: 0,
  };

  sendServerMessageforClient(
    game.clientsKey[1],
    convertServerMessage(message)
  );
  sendServerMessageforClient(
    game.clientsKey[2],
    convertServerMessage(message)
  );

  


}




export default attac;
