import WebSocket from "ws";
import { httpServer } from "./http_server/index.js";
import handleMessage from "./service/handleMessage";
import { convertMessageToStr } from "./utils/convertMessage";
import ClientsModel from "./model/clientsModel";

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
    const clientMessage = convertMessageToStr(message);
    console.log(`Client's message: ${clientMessage}`);

    handleMessage(server, ws, clientMessage, index);
  });

  ws.on("close", () => {
    ClientsModel.deleteClient(index);
    console.log(`Client disconnection. Id: ${index}`);
  });
});

server.on("error", (e) => {
  console.log(`Server error: ${e}`);
});
