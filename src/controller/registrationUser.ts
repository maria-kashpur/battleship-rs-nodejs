import { IncomingMessage } from "http";
import ClientsModel from "../model/clientsModel";
import { UsersModel } from "../model/usersModel";
import { ReqClient } from "../types/clientMessageTypes";
import { ReqServer } from "../types/serverMessageTypes";
import WebSocket from "ws";
import { Commands } from "../types/types";
import {
  convertServerMessage,
  sendServerMessageforClient,
} from "../utils/messageHelper";
import updateRooms from "./updateRooms";
import updateWinners from "./uppateWinners";

const registrationUser = (
  server: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>,
  clientKey: string,
  data: ReqClient["data"],
) => {
  const registrationUser: ReqServer = {
    type: Commands.registrationUser,
    data: getRegistrationsData(data, clientKey),
    id: 0,
  };

  sendServerMessageforClient(clientKey, convertServerMessage(registrationUser));

  if (!registrationUser.data.error) {
    updateRooms(server);
    updateWinners(server);
  }
};

function getRegistrationsData(
  data: ReqClient["data"],
  clientKey: string,
): ReqServer["data"] {
  if (!data.name || !data.password) {
    return {
      error: true,
      errorText: "name or password is not found",
    };
  }

  const { name, password } = data;

  const user = UsersModel.getUserbyName(name);

  if (!user) {
    const newUser = UsersModel.createUser(name, password);
    ClientsModel.updateUserID(clientKey, newUser.id);
    return { name, index: newUser.id, error: false };
  }

  const passwordIsValid = user.password === password;
  if (passwordIsValid) {
    ClientsModel.updateUserID(clientKey, user.id);
  }

  return passwordIsValid
    ? { name, index: user.id, error: false }
    : {
        error: true,
        errorText: `Invalid password or username "${name}" is already taken`,
      };
}

export default registrationUser;
