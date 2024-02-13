import ws from "ws";
import { httpServer } from "./http_server/index.js";

const HTTP_PORT = 8181;
const SOKET_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port! 
Go to http://localhost:8181/`);
httpServer.listen(HTTP_PORT);

const socketServer = new ws.Server({ port: SOKET_PORT });

socketServer.on("connection", (ws) => {
  console.log(`Socket server start: http://localhost:${SOKET_PORT}/ `);

  ws.on("message", (message) => {
    console.log(message.toString());
    const res = {
      type: "reg",
      data: {
        name: "Masha",
        index: 1,
        error: false,
        errorText: "AAAAAAAa",
      },
      id: 0,
    };

    ws.send(JSON.stringify(res));
  });

  ws.on("close", () => {
    console.log("Socket server closed");
  });
});

socketServer.on("error", (e) => {
  console.log(e);
});
