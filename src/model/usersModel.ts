import { users } from "../data/data";
import { User, UserWins } from "../types/types";
import counter from "../utils/counter";

export class UsersModel {
  private static generateUserID = counter();

  static createUser(name: string, password: string): User {
    const id = this.generateUserID();
    const user: User = {
      name,
      password,
      id,
      wins: 0,
    };
    users.push(user);
    return user;
  }

  static getUserbyName(name: string): User | null {
    const user = users.find((el) => el.name === name);
    return user ? user : null;
  }

  static getUserbyID(id: User["id"]): User | null {
    const user = users.find((el) => el.id === id);
    return user ? user : null;
  }

  static getInfoAboutWins(): { name: User["name"]; wins: User["wins"] }[] {
    return users.reduce((acc: UserWins[], user) => {
      const { name, wins } = user;
      if (wins > 0) {
        acc.push({ name, wins });
      }
      return acc;
    }, []);
  }
}
