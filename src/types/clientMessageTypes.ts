import { Commands } from "./types";

export interface ReqClient {
  type: Commands.registrationUser;
  data: {
    name: string;
    password: string;
  };
  id: 0;
}
