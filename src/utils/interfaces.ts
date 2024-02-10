export interface IRes {
  code: number;
  message: string | IUser;
}

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
