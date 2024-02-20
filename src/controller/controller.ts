import { clients } from "../data/clients";
import { games } from "../data/data";
import ClientsModel from "../model/clientsModel";
import GamesModel from "../model/gamesModel";
import { RoomsModel } from "../model/roomsModel";
import { UsersModel } from "../model/usersModel";
import { ReqClient } from "../types/clientMessageTypes";
import {
  AddUserToRoomServer,
  ReqServer,
  StartGameServer,
  UpdateRoomServer,
  UpdateWinnersServer,
} from "../types/serverMessageTypes";
import { Ship } from "../types/types";

export default class Controller {
  static registrationUser(
    data: ReqClient["data"],
    clientID: string
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
      ClientsModel.updateUserID(clientID, newUser.id);
      return { name, index: newUser.id, error: false };
    }

    const passwordIsValid = user.password === password;
    if (passwordIsValid) {
      ClientsModel.updateUserID(clientID, user.id);
    }

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

  static createRoom(clientID: string): UpdateRoomServer["data"] {
    const userID = ClientsModel.getUserID(clientID);
    if (!userID) throw new Error("userID is not found");
    const room = RoomsModel.createRoom(userID);
    ClientsModel.updateRoomID(clientID, room.id);
    return this.updateRooms();
  }

  private static removeRoom(clientID: string, idRoom: number): void {
    ClientsModel.resetRoomId(clientID);
    RoomsModel.deleteRoom(idRoom);
  }

  static createGame(
    index: string,
    idRoom: number
  ):
    | {
        index: string;
        result: AddUserToRoomServer["data"];
      }[]
    | null {
    const clientIndexOfCreatorRoom =
      ClientsModel.getClientIndexesByRoomId(idRoom);
    if (!clientIndexOfCreatorRoom) throw new Error("index is not found");

    const idCreactor = ClientsModel.getUserID(clientIndexOfCreatorRoom);
    const idRival = ClientsModel.getUserID(index);

    if (!idCreactor || !idRival) throw new Error("id is not found");
    if (idCreactor === idRival) return null;

    const game = GamesModel.createGame(idCreactor, idRival);
    ClientsModel.updateGameID(index, game.id);
    ClientsModel.updateGameID(clientIndexOfCreatorRoom, game.id);

    return [
      {
        index: index,
        result: {
          idGame: game.id,
          idPlayer: 2,
        },
      },
      {
        index: clientIndexOfCreatorRoom,
        result: {
          idGame: game.id,
          idPlayer: 1,
        },
      },
    ];
  }

  static addShips(
    gameId: number,
    ships: Ship[],
    indexPlayer: number
  ): { data: StartGameServer["data"]; index: string}[] | null {
    const game = GamesModel.getGamebyId(gameId);
    
    if (!game) throw new Error("game is not found");
    const validIndexPlayer = indexPlayer === 1 ? 1 : indexPlayer === 2 ? 2 : 0;
    if (validIndexPlayer === 0) throw new Error("invalid indexPlayer");

    const startGame = game.addShips(validIndexPlayer, ships);
    const result = startGame?.map((el) => {
      const userID = el.userID;
      const clientID = ClientsModel.getIDClientIndexesByRoomId(game.id, userID);
      if (clientID === null) throw new Error("Client in not found")
      return {
        data: el.data,
        index: clientID,
      };
    });

    return result === undefined ? null : result 
  }
}
