import dotenv from 'dotenv';
import { env, argv } from 'node:process';
import { exit } from 'node:process';
import cluster from 'node:cluster';
import { IUser } from './utils/interfaces';
import httpServer from './modules/server';
import { PORT_NOT_FOUND } from './utils/consts';
import primaryWorker from './modules/workers/primaryWorker';
import regularWorker from './modules/workers/regularWorker';

dotenv.config();
const port = env.port;
const isMulti = !!argv.find((e) => /^--multi/.test(e));

if (!port) {
  console.log(PORT_NOT_FOUND);
  exit();
}

if (!isMulti) {
  const userList: Map<string, IUser> = new Map();
  httpServer(port, userList);
} else {
  cluster.schedulingPolicy = cluster.SCHED_RR;
  if (cluster.isPrimary) primaryWorker();
  else regularWorker(port);
}
