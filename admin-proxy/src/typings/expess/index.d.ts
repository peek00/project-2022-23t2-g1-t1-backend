import { IUser } from "..";

declare global {
  namespace Express {
    interface User extends IUser{}
  }
}