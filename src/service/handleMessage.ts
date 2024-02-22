import { Commands } from "../types/types";
import { IncomingMessage } from "http";
import WebSocket from "ws";
import { parseMessageClient } from "../utils/messageHelper";
import registrationUser from "../controller/registrationUser";
import createRoom from "../controller/createRoom";
import addUserToRoom from "../controller/createGame";
import addShips from "../controller/addShips";
import attac from "../controller/attack";
import playWithBot from "../controller/playWithBot";
import randomAttac from "../controller/randomAttac";

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
      addUserToRoom(server, clientKey, clientMessage.data);
      break;

    case Commands.playWithBot:
      playWithBot(server, clientKey);
      break;

    case Commands.addShips:
      addShips(server, clientMessage.data);
      break;

    case Commands.attack:
      attac(server, clientMessage.data);
      break;

    case Commands.randomAttack:
      randomAttac(server, clientMessage.data);
      break;

    default:
      console.error(`type ${clientMessage.type} is not found`);
      break;
  }
}
