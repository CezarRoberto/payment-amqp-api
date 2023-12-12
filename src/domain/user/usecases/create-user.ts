import { User } from "@domain/user/entities/user";

export interface CreateUser {
  execute: (params:CreateUser.Params) => Promise<User>
}

export namespace CreateUser {
  export type Params = {
    name?: string;
    email: string;
  }
}