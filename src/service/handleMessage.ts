import { Commands } from "../types/types";
import Controller from "../controller/controller";
import { IncomingMessage } from "http";
import WebSocket from "ws";
import { parseMessage, convertServerMessage } from "../utils/convertMessage";
import {
  AddUserToRoomServer,
  AttackFeedbackServer,
  ReqServer,
  StartGameServer,
  TurnServer,
  UpdateRoomServer,
  UpdateWinnersServer,
} from "../types/serverMessageTypes";
import { clients } from "../data/clients";
import { AddShipsToBoardClient, AttacClient } from "../types/clientMessageTypes";

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

      console.log(`Server's message: ${JSON.stringify(registrationUser)}\n`);
      ws.send(convertServerMessage(registrationUser));

      const updateRoomsAfterReq: UpdateRoomServer = {
        type: Commands.updateRoom,
        data: Controller.updateRooms(),
        id: 0,
      };
      console.log(
        `Server's message: ${JSON.stringify(updateRoomsAfterReq)}\n`
      );
      sendMessageClients(server, convertServerMessage(updateRoomsAfterReq));

      const updateWinsArterReg: UpdateWinnersServer = {
        type: Commands.updateWinners,
        data: Controller.uppateWinners(),
        id: 0,
      };
      console.log(`Server's message: ${JSON.stringify(updateWinsArterReg)}\n`);
      sendMessageClients(server, convertServerMessage(updateWinsArterReg));

      break;

    case Commands.createRoom:
      const createRoom = Controller.createRoom(index);

      const updateRoomAfterCreateRoom: UpdateRoomServer = {
        type: Commands.updateRoom,
        data: createRoom,
        id: 0,
      };
      console.log(
        `Server's message: ${JSON.stringify(updateRoomAfterCreateRoom)}\n`
      );
      sendMessageClients(
        server,
        convertServerMessage(updateRoomAfterCreateRoom),
      );

      break;

    case Commands.addUserToRoom:
      const addUsersToRoom = Controller.createGame(
        index,
        clientMessage.data.indexRoom,
      );

      const updateRooms: UpdateRoomServer = {
        type: Commands.updateRoom,
        data: Controller.updateRooms(),
        id: 0,
      };
      console.log(`Server's message: ${JSON.stringify(updateRooms)}\n`);
      sendMessageClients(server, convertServerMessage(updateRooms));

      if (!addUsersToRoom) return;
      addUsersToRoom.forEach((el) => {
        const { index, result } = el;
        const addUserToRoom: AddUserToRoomServer = {
          type: Commands.createGame,
          data: result,
          id: 0,
        };
        console.log(`Server's message: ${JSON.stringify(addUserToRoom)}\n`);

        clients[index].ws.send(convertServerMessage(addUserToRoom));
      });

      break;

    case Commands.playWithBot:
      break;

    case Commands.addShips:
      const { gameId, ships, indexPlayer }: AddShipsToBoardClient['data'] =
        clientMessage.data;
      const startGame = Controller.addShips(gameId, ships, indexPlayer);

      if (startGame !== null) {
        startGame.forEach(el => {
          const message: StartGameServer = {
            type: Commands.start,
            data: el.data,
            id: 0,
          };
          console.log(`Server's message: ${JSON.stringify(message)}\n`);
          clients[el.index].ws.send(convertServerMessage(message));

          const turn: TurnServer = {
            type: Commands.turn,
            data: {
              currentPlayer: 1,
            },
            id: 0,
          };
          console.log(`Server's message: ${JSON.stringify(turn)}\n`);
          clients[el.index].ws.send(convertServerMessage(turn));
        })
      }

      break;

    case Commands.attack:
     const attac = Controller.attac(clientMessage.data)
      // attac.clients.forEach(key => {
      //   if (!key) return;
      //   if (attac.data === null) return;
      //   const { feedBackAttac, turn } = attac.data;

      //   feedBackAttac.forEach((data) => {
      //     const attackFeedback: AttackFeedbackServer = {
      //       type: Commands.attack,
      //       data,
      //       id: 0,
      //     };
      //     console.log(JSON.stringify(attackFeedback));
      //     clients[key].ws.send(convertServerMessage(attackFeedback));
      //   });

      //   const turnMessage: TurnServer = {
      //     type: Commands.turn,
      //     data: turn,
      //     id: 0
      //   };
      //   console.log(JSON.stringify(turnMessage));
      //   clients[key].ws.send(convertServerMessage(turnMessage));
      // })



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
