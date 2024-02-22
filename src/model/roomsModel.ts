import { rooms } from "../data/data";
import { PartialRoom, Room, User } from "../types/types";
import counter from "../utils/counter";
import { UsersModel } from "./usersModel";

export class RoomsModel {
  private static generateRoomID = counter();

  static createRoom(idCreactor: User["id"]): Room {
    const id = this.generateRoomID();
    const user = UsersModel.getUserbyID(idCreactor);
    if (!user) throw new Error("user is not found");
    const room: Room = {
      id,
      idGame: null,
      idCreactor,
      nameCreator: user.name,
      idRival: null,
    };
    rooms.push(room);
    return room;
  }

  static getRoomByID(id: Room["id"]): Room | null {
    const room = rooms.find((el) => el.id === id);
    return room ? room : null;
  }

  static getPartialRooms(): PartialRoom[] {
    return rooms.reduce((acc: PartialRoom[], room) => {
      const { idRival, id, idCreactor, nameCreator } = room;
      if (idRival === null) {
        const partialRoom = {
          roomId: id,
          roomUsers: [
            {
              name: nameCreator,
              index: idCreactor,
            },
          ],
        };
        acc.push(partialRoom);
      }
      return acc;
    }, []);
  }

  static deleteRoom(id: Room["id"]): boolean {
    const indexRoomData = rooms.findIndex((room) => room.id === id);
    if (indexRoomData === -1) {
      return false;
    }
    rooms.splice(indexRoomData, 1);
    return true;
  }
}
