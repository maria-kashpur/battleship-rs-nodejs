import { Commands } from "../types/types";
import Controller from "../controller/controller";
import { IncomingMessage } from "http";
import WebSocket from "ws";
import { parseMessage, convertServerMessage } from "../utils/convertMessage";
import {
  ReqServer,
  UpdateRoomServer,
  UpdateWinnersServer,
} from "../types/serverMessageTypes";

export default function handleMessage(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  ws: WebSocket,
  message: string,
  index: string,
) {
  const clientMessage = parseMessage(message);

  switch (clientMessage.type) {
    case Commands.registrationUser:
      const registrationUser: ReqServer = {
        type: Commands.registrationUser,
        data: Controller.registrationUser(clientMessage.data, index),
        id: 0,
      };

      console.log(`Server's message: ${registrationUser}`);
      ws.send(convertServerMessage(registrationUser));

      const updateRoomsAfterReq: UpdateRoomServer = {
        type: Commands.updateRoom,
        data: Controller.updateRooms(),
        id: 0,
      };
      console.log(`Server's message: ${updateRoomsAfterReq}`);
      sendMessageClients(server, convertServerMessage(updateRoomsAfterReq));

      const updateWinsArterReg: UpdateWinnersServer = {
        type: Commands.updateWinners,
        data: Controller.uppateWinners(),
        id: 0,
      };
      console.log(`Server's message: ${updateWinsArterReg}`);
      sendMessageClients(server, convertServerMessage(updateWinsArterReg));

      break;

    case Commands.createRoom:
      break;

    case Commands.addUserToRoom:
      break;

    case Commands.addShips:
      break;

    case Commands.attack:
      break;

    case Commands.randomAttack:
      break;

    default:
      console.error(`type ${clientMessage.type} is not found`);
      break;
  }
}

function sendMessageClients(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  message: string,
): void {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
