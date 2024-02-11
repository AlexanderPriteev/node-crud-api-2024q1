import process from 'node:process';
import { IRes, IUser } from '../utils/interfaces';
import http from 'node:http';
import get from './commands/get';
import post from './commands/post';
import put from './commands/put';
import remove from './commands/delete';
import { NOT_IMPLEMENTED } from '../utils/consts';

export default function httpServer(
  port: string,
  userList: Map<string, IUser>,
  isCluster = false,
) {
  const server = http.createServer(async (req, res) => {
    let response: IRes;
    let isUpdate = true;
    const { method } = req;

    switch (method) {
      case 'GET':
        response = get(req, userList);
        break;
      case 'POST':
        response = await post(req, userList);
        break;
      case 'PUT':
        response = await put(req, userList);
        break;
      case 'DELETE':
        response = remove(req, userList);
        break;
      default:
        response = { code: 400, message: NOT_IMPLEMENTED };
        isUpdate = false;
    }

    if (isCluster && isUpdate) {
      process.send?.({ type: 'userListUpdate', data: Array.from(userList) });
    }
    res.writeHead(response.code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response.message));
  });

  server.listen(port, () => console.log(`PORT ${port} is ready`));
}
