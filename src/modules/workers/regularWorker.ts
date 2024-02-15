import { IMessage, IUser } from '../../utils/interfaces';
import cluster from 'node:cluster';
import process from 'node:process';
import httpServer from '../server';

export default function regularWorker(port: string) {
  const userList: Map<string, IUser> = new Map();
  const thisPort = `${Number(port) + (cluster.worker?.id || 0) - 1}`;
  process.on('message', (message: IMessage) => {
    if (message.type === 'userList') {
      userList.clear();
      for (const [key, value] of message.data) {
        userList.set(key, value);
      }
    }
  });
  httpServer(thisPort, userList, true);
}
