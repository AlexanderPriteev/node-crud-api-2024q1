export interface IRes {
  code: number;
  message: string | IUser | IUser[];
}

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface IMessage {
  type: string;
  data: [string, IUser][];
}
