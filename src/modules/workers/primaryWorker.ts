import { availableParallelism } from 'node:os';
import { IMessage, IUser } from '../../utils/interfaces';
import cluster from 'node:cluster';

export default function primaryWorker() {
  const numCPUs = availableParallelism();
  let userList: [string, IUser][] = [];

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.send({ type: 'userList', data: userList });
  }

  cluster.on('message', (_, message: IMessage) => {
    if (message.type === 'userListUpdate') {
      userList = Array.from(message.data); // Обновляем userList
      for (const id in cluster.workers) {
        if (cluster.workers[id]) {
          cluster.workers[id]?.send({ type: 'userList', data: userList });
        }
      }
    }
  });
}
