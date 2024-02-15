import { IncomingMessage } from 'node:http';
import { IRes, IUser } from '../../utils/interfaces';
import { INVALID_ENDPOINT, SERVER_ERR } from '../../utils/consts';
import getUser from '../../utils/getUser';

export default function get(
  req: IncomingMessage,
  userList: Map<string, IUser>,
) {
  let data: IRes = { code: 400, message: INVALID_ENDPOINT };
  try {
    const URL = String(req.url);
    if (URL === '/api/users') {
      const message = [...userList.values()];
      data = { code: 200, message };
    } else if (/^\/api\/users\//.test(URL)) {
      data = getUser(URL, userList);
    }
    return data;
  } catch {
    data = { code: 500, message: SERVER_ERR };
    return data;
  }
}
