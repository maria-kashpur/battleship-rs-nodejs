import WebSocket from "ws";
import { httpServer } from "./http_server/index.js";
import handleMessage from "./service/handleMessage";
import { convertMessageClientToStr } from "./utils/messageHelper";
import ClientsModel from "./model/clientsModel";
import { clients } from "./data/clients";
import GamesModel from "./model/gamesModel";
import { UsersModel } from "./model/usersModel";
import registrationUser from "./controller/registrationUser";

const HTTP_PORT = 8181;
const SOKET_PORT = 3000;

httpServer.listen(HTTP_PORT, () => {
  console.log(
    `Start static http server on the ${HTTP_PORT} port! Go to http://localhost:8181/`,
  );
});

const server = new WebSocket.Server({ port: SOKET_PORT });

server.on("listening", () => {
  console.log(`Socket server start: http://localhost:${SOKET_PORT}/`);
});

server.on("close", () => {
  console.log("Socket server closed");
});

server.on("error", (e) => {
  console.log("Server socket error", e);
});

server.on("connection", (ws) => {
  const index = ClientsModel.createClient(ws);
  console.log(`Client established connection: id ${index}`);

  ws.on("message", (message) => {
    const clientMessage = convertMessageClientToStr(message);
    console.log(`Client's message: ${clientMessage}`);
    try {
      handleMessage(server, ws, clientMessage, index);
    } catch (e) {
      console.error(e);
    }
  });

  ws.on("close", () => {
    const { gameID } = clients[index];
    if (gameID !== null) {
      const game = GamesModel.getGamebyId(gameID);
      if (!game) throw new Error("game is not found");
      const otherClientKey =
        game.clientsKey[1] === index ? game.clientsKey[2] : game.clientsKey[1];
      const otherClient = clients[otherClientKey];
      const userData =
        otherClient.userID !== null
          ? UsersModel.getUserbyID(otherClient.userID)
          : null;

      if (userData !== null) {
        registrationUser(server, otherClientKey, {
          name: userData.name,
          password: userData.password,
        });
      }
    }
    ClientsModel.deleteClient(index);
    console.log(`Client disconnection. Id: ${index}`);
  });
});

server.on("error", (e) => {
  console.log(`Server error: ${e}`);
});
