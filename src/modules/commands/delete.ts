import { IncomingMessage } from 'node:http';
import { IRes, IUser } from '../../utils/interfaces';
import { INVALID_ENDPOINT, SERVER_ERR, USER_DEL } from '../../utils/consts';
import getUser from '../../utils/getUser';

export default function remove(
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
      userList.delete(user.id);
      data = { code: 204, message: USER_DEL };
    }
    return data;
  } catch {
    data = { code: 500, message: SERVER_ERR };
    return data;
  }
}
