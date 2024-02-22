import WebSocket from "ws";
import { Commands } from "../types/types";
import {
  AddUserToRoomServer,
  ReqServer,
  StartGameServer,
  UpdateRoomServer,
  UpdateWinnersServer,
  TurnServer,
  AttackFeedbackServer,
  FinishGameServer,
} from "../types/serverMessageTypes";
import { IncomingMessage } from "http";
import { clients } from "../data/clients";

export function convertMessageClientToStr(message: WebSocket.RawData) {
  return message && typeof message === "string" ? message : message.toString();
}

export function parseMessageClient(message: string) {
  let parseMes;
  try {
    parseMes = JSON.parse(message);
  } catch (e) {
    throw new Error("client's message is not object");
  }
  if (!("type" in parseMes || "data" in parseMes)) {
    throw new Error(`client's message is not valid`);
  }

  const result = {
    ...parseMes,
    data:
      parseMes.data.length === 0 ? parseMes.data : JSON.parse(parseMes.data),
  };

  if (
    result.type === Commands.registrationUser &&
    !("name" in result.data || "password" in result.data)
  ) {
    throw new Error("password or name is not found");
  }

  if (result.type === Commands.addUserToRoom && !("indexRoom" in result.data)) {
    throw new Error(`indexRoom is not found`);
  }

  if (
    result.type === Commands.addShips &&
    !("gameId" in result.data) &&
    !("ships" in result.data) &&
    !("indexPlayer" in result.data)
  ) {
    throw new Error("invalid AddShipsToBoardClient");
  }

  return result;
}

export function convertServerMessage(
  message:
    | ReqServer
    | UpdateWinnersServer
    | UpdateRoomServer
    | AddUserToRoomServer
    | StartGameServer
    | TurnServer
    | AttackFeedbackServer
    | FinishGameServer
) {
  return JSON.stringify({
    ...message,
    data: JSON.stringify(message.data),
  });
}

export function sendServerMessageforClient(
  clientIndex: string,
  message: string,
) {
  if (!(clientIndex in clients)) return;

  const { ws } = clients[clientIndex];
  if (ws.readyState === WebSocket.OPEN) {
    console.log(`Server message: ${message} \n`);
    ws.send(message);
  }
}

export function sendServerMessageforAllClients(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  message: string,
): void {
  console.log(`Server message: ${message}\n`);

  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
