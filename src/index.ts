import http from 'node:http';
import dotenv from 'dotenv';
import { env } from 'node:process';
import * as console from 'console';

dotenv.config();

interface IRes {
  code: number;
  message: string;
}

const server = http.createServer((req, res) => {
  let response: IRes;

  const { method } = req;
  console.log(method);
  switch (method) {
    case 'GET':
      response = { code: 200, message: 'GET' };
      break;
    case 'POST':
      response = { code: 201, message: 'POST' };
      break;
    case 'PUT':
      response = { code: 200, message: 'PUT' };
      break;
    case 'DELETE':
      response = { code: 204, message: 'DELETE' };
      break;
    default:
      response = { code: 404, message: 'Invalid Endpoint' };
  }

  res.writeHead(response.code, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: response.message,
    }),
  );
});

server.listen(env.port, () => console.log(`PORT is ${env.port}`));
