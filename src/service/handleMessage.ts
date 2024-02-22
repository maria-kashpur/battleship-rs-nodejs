import { Commands } from "../types/types";
import { IncomingMessage } from "http";
import WebSocket from "ws";
import { parseMessageClient } from "../utils/messageHelper";
import registrationUser from "../controller/registrationUser";
import createRoom from "../controller/createRoom";
import createGame from "../controller/createGame";
import addShips from "../controller/addShips";
import attac from "../controller/attack";

export default function handleMessage(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  ws: WebSocket,
  message: string,
  clientKey: string,
) {
  const clientMessage = parseMessageClient(message);

  switch (clientMessage.type) {
    case Commands.registrationUser:
      registrationUser(server, clientKey, clientMessage.data);
      break;

    case Commands.createRoom:
      createRoom(server, clientKey);
      break;

    case Commands.addUserToRoom:
      createGame(server, clientKey, clientMessage.data);
      break;

    case Commands.playWithBot:
      break;

    case Commands.addShips:
      addShips(clientMessage.data);
      break;

    case Commands.attack:
      attac(clientMessage.data);
      break;

    case Commands.randomAttack:
      break;

    default:
      console.error(`type ${clientMessage.type} is not found`);
      break;
  }
}
