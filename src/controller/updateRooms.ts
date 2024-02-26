import { IncomingMessage } from "http";
import WebSocket from "ws";
import { UpdateRoomServer } from "../types/serverMessageTypes";
import { Commands } from "../types/types";
import { RoomsModel } from "../model/roomsModel";
import {
  convertServerMessage,
  sendServerMessageforAllClients,
} from "../utils/messageHelper";

export default function updateRooms(
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
) {
  const data = RoomsModel.getPartialRooms();

  const updateRoomsAfterReq: UpdateRoomServer = {
    type: Commands.updateRoom,
    data,
    id: 0,
  };

  sendServerMessageforAllClients(
    server,
    convertServerMessage(updateRoomsAfterReq),
  );
}
