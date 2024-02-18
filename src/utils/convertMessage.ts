import WebSocket from "ws";
import { Commands } from "../types/types";
import {
  ReqServer,
  UpdateRoomServer,
  UpdateWinnersServer,
} from "../types/serverMessageTypes";

export function convertMessageToStr(message: WebSocket.RawData) {
  return message && typeof message === "string" ? message : message.toString();
}

export function parseMessage(message: string) {
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
    data: JSON.parse(parseMes.data),
  };

  if (
    result.type === Commands.registrationUser &&
    !("name" in result.data || "password" in result.data)
  ) {
    throw new Error("password or name is not found");
  }

  return result;
}

export function convertServerMessage(
  message: ReqServer | UpdateWinnersServer | UpdateRoomServer,
) {
  return JSON.stringify({
    ...message,
    data: JSON.stringify(message.data),
  });
}
