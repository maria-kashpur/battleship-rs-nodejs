import WebSocket from "ws";
import { httpServer } from "./http_server/index.js";
import handleMessage from "./service/handleMessage";
import { convertMessageClientToStr } from "./utils/messageHelper";
import ClientsModel from "./model/clientsModel";
import closeConnection from "./controller/closeConnection";

const HTTP_PORT = 8181;
const SOKET_PORT = 3000;

httpServer.listen(HTTP_PORT, () => {
  console.log(
    `Start static http server on the ${HTTP_PORT} port! Go to http://localhost:8181/\n`,
  );
});

const server = new WebSocket.Server({ port: SOKET_PORT });

server.on("listening", () => {
  console.log(`Socket server start: http://localhost:${SOKET_PORT}/\n`);
});

server.on("close", () => {
  console.log("Socket server closed.\n");
});

server.on("error", (e) => {
  console.log("Server socket error:", e, "\n");
});

server.on("connection", (ws) => {
  const index = ClientsModel.createClient(ws);
  console.log(`Client established connection: id ${index}\n`);

  ws.on("message", (message) => {
    const clientMessage = convertMessageClientToStr(message);
    console.log(`Client's message: ${clientMessage}\n`);
    try {
      handleMessage(server, ws, clientMessage, index);
    } catch (e) {
      console.error(e);
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnection. Id: ${index}\n`);
    closeConnection(server, index);
  });
});

server.on("error", (e) => {
  console.log(`Server error: ${e}`);
});
