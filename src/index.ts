import http from 'node:http';
import dotenv from 'dotenv';
import { env } from 'node:process';
import { IRes, IUser } from './utils/interfaces';
import post from './modules/post';
import get from './modules/get';
import { NOT_IMPLEMENTED } from './utils/consts';
import remove from './modules/delete';

dotenv.config();

const userList: Map<string, IUser> = new Map();

const server = http.createServer(async (req, res) => {
  let response: IRes;
  const { method } = req;

  switch (method) {
    case 'GET':
      response = get(req, userList);
      break;
    case 'POST':
      response = await post(req, userList);
      break;
    case 'PUT':
      response = { code: 200, message: 'PUT' };
      break;
    case 'DELETE':
      response = remove(req, userList);
      break;
    default:
      response = { code: 501, message: NOT_IMPLEMENTED };
  }

  res.writeHead(response.code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response.message));
});

server.listen(env.port, () => console.log(`PORT is ${env.port}`));
