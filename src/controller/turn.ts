import { Game } from "../model/gamesModel";
import { TurnServer } from "../types/serverMessageTypes";
import { Commands } from "../types/types";
import {
  convertServerMessage,
  sendServerMessageforClient,
} from "../utils/messageHelper";

function turn(game: Game) {
  const message: TurnServer = {
    type: Commands.turn,
    data: {
      currentPlayer: game.getCurrentPlayer(),
    },
    id: 0,
  };

  sendServerMessageforClient(game.clientsKey[1], convertServerMessage(message));
  sendServerMessageforClient(game.clientsKey[2], convertServerMessage(message));
}

export default turn;
