import { IRes, IUser } from '../../utils/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage } from 'node:http';
import { INVALID_ENDPOINT, NOT_REQUIRED, SERVER_ERR } from '../../utils/consts';
import isUser from '../../utils/isUser';

export default async function post(
  req: IncomingMessage,
  userList: Map<string, IUser>,
) {
  let data: IRes = { code: 400, message: INVALID_ENDPOINT };
  try {
    let message: string = '';
    if (req.url !== '/api/users') return data;
    await new Promise<void>((res) => {
      req.on('data', (chunk) => (message += chunk.toString()));
      req.on('end', res);
    });
    if (!isUser(message)) {
      data.message = NOT_REQUIRED;
      return data;
    }
    const dataObj = JSON.parse(message);
    const newUser = { id: uuidv4(), ...dataObj } as IUser;
    userList.set(newUser.id, newUser);
    data = { code: 201, message: newUser };
    return data;
  } catch {
    data = { code: 500, message: SERVER_ERR };
    return data;
  }
}
