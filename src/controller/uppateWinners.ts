import { IncomingMessage } from "http";
import WebSocket from "ws";
import { UpdateWinnersServer } from "../types/serverMessageTypes";
import { Commands } from "../types/types";
import {
  convertServerMessage,
  sendServerMessageforAllClients,
} from "../utils/messageHelper";
import { UsersModel } from "../model/usersModel";

export default function updateWinners(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
) {
  const data = UsersModel.getInfoAboutWins();

  const updateWinners: UpdateWinnersServer = {
    type: Commands.updateWinners,
    data,
    id: 0,
  };

  sendServerMessageforAllClients(server, convertServerMessage(updateWinners));
}
