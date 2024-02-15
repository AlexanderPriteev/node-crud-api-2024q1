import { IRes, IUser } from './interfaces';
import { validate as uuidValidate } from 'uuid';
import { INVALID_ID, NOT_FOUND } from './consts';

export default function getUser(
  str: string,
  userList: Map<string, IUser>,
): IRes {
  let data: IRes = { code: 400, message: INVALID_ID };
  const id = str.replace(/^\/api\/users\//, '');
  if (!uuidValidate(id)) return data;
  const user = userList.get(id);
  if (user) data = { code: 200, message: user };
  else data = { code: 404, message: NOT_FOUND };
  return data;
}
