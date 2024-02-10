import { IncomingMessage } from 'node:http';
import { IRes, IUser } from '../utils/interfaces';
import { INVALID_ENDPOINT, SERVER_ERR } from '../utils/consts';
import getUser from '../utils/getUser';
import { isHobbies } from '../utils/isUser';

export default async function put(
  req: IncomingMessage,
  userList: Map<string, IUser>,
) {
  let data: IRes = { code: 400, message: INVALID_ENDPOINT };
  try {
    const URL = String(req.url);
    if (!/^\/api\/users\//.test(URL)) return data;
    data = getUser(URL, userList);
    const user = data.message;
    if (typeof user !== 'string' && !Array.isArray(user)) {
      let message: string = '';
      await new Promise<void>((res) => {
        req.on('data', (chunk) => (message += chunk.toString()));
        req.on('end', res);
      });

      const dataObj = JSON.parse(message);
      const item = userList.get(user.id) as IUser;
      item.username =
        typeof dataObj.username === 'string' ? dataObj.username : item.username;
      item.age = typeof dataObj.age === 'number' ? dataObj.age : item.age;
      item.hobbies = isHobbies(dataObj.hobbies)
        ? dataObj.hobbies
        : item.hobbies;

      data = { code: 200, message: userList.get(user.id) as IUser };
    }
    return data;
  } catch {
    data = { code: 500, message: SERVER_ERR };
    return data;
  }
}
