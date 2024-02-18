import ClientsModel from "../model/clientsModel";
import { RoomsModel } from "../model/roomsModel";
import { UsersModel } from "../model/usersModel";
import { ReqClient } from "../types/clientMessageTypes";
import {
  ReqServer,
  UpdateRoomServer,
  UpdateWinnersServer,
} from "../types/serverMessageTypes";

export default class Controller {
  static registrationUser(
    data: ReqClient["data"],
    index: string,
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

      return { name, index: newUser.id, error: false };
    }

    const passwordIsValid = user.password === password;

    ClientsModel.updateUserID(user.id);

    return passwordIsValid
      ? { name, index: user.id, error: false }
      : {
          error: true,
          errorText: `Invalid password or username "${name}" is already taken`,
        };
  }

  static uppateWinners(): UpdateWinnersServer["data"] {
    return UsersModel.getInfoAboutWins();
  }

  static updateRooms(): UpdateRoomServer["data"] {
    return RoomsModel.getPartialRooms();
  }
}
