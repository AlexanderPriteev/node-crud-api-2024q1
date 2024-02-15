import { IUser } from '../utils/interfaces';
import httpServer from '../modules/server';
import { validate as uuidValidate } from 'uuid';
import { NOT_FOUND } from '../utils/consts';

const HEADER = { 'Content-Type': 'application/json' };
const TEST_ID = '2207a398-5e3c-4a58-a07c-b53131b05919';
const TEST_DATA = {
  username: 'User Name',
  age: 24,
  hobbies: ['test1', 'test2'],
};

describe('Tests for API', () => {
  const port = 4080;
  const userList: Map<string, IUser> = new Map<string, IUser>();
  const server = httpServer(port.toString(), userList);

  beforeEach(() => {
    userList.clear();
  });

  afterAll(() => {
    server.close();
  });

  test('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const response = await fetch(`http://localhost:${port}/api/users`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  test('Get all records with a GET api/users request (array with 1 user)', async () => {
    userList.set(TEST_ID, { id: TEST_ID, ...TEST_DATA });
    const response = await fetch(`http://localhost:${port}/api/users`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: TEST_ID, ...TEST_DATA }]);
  });

  test('A new object is created by a POST api/users request', async () => {
    const response = await fetch(`http://localhost:${port}/api/users`, {
      method: 'POST',
      headers: HEADER,
      body: JSON.stringify(TEST_DATA),
    });
    expect(response.status).toBe(201);
    const data = (await response.json()) as IUser;
    expect(uuidValidate(data.id)).toBeTruthy();
    expect(data.username).toEqual(TEST_DATA.username);
    expect(data.age).toEqual(TEST_DATA.age);
    expect(data.hobbies).toEqual(TEST_DATA.hobbies);
  });

  test('With a GET api/user/{userId} request, we try to get the created record by its id', async () => {
    const responsePost = await fetch(`http://localhost:${port}/api/users`, {
      method: 'POST',
      headers: HEADER,
      body: JSON.stringify(TEST_DATA),
    });
    const data = (await responsePost.json()) as IUser;
    const responseGet = await fetch(
      `http://localhost:${port}/api/users/${data.id}`,
    );
    expect(await responseGet.json()).toEqual(data);
  });

  test('We try to update the created record with a PUT api/users/{userId} request', async () => {
    const NEW_NAME = 'Test';
    const NEW_AGE = 99;
    userList.set(TEST_ID, { id: TEST_ID, ...TEST_DATA });
    const response = await fetch(
      `http://localhost:${port}/api/users/${TEST_ID}`,
      {
        method: 'PUT',
        headers: HEADER,
        body: JSON.stringify({ username: NEW_NAME, age: NEW_AGE }),
      },
    );
    expect(response.status).toBe(200);
    const data = (await response.json()) as IUser;
    expect(data.id).toEqual(TEST_ID);
    expect(data.username).toEqual(NEW_NAME);
    expect(data.age).toEqual(NEW_AGE);
    expect(data.hobbies).toEqual(TEST_DATA.hobbies);
  });

  test('With a DELETE api/users/{userId} request, we delete the created object by id', async () => {
    userList.set(TEST_ID, { id: TEST_ID, ...TEST_DATA });
    const response = await fetch(
      `http://localhost:${port}/api/users/${TEST_ID}`,
      {
        method: 'DELETE',
      },
    );
    expect(response.status).toBe(204);
  });

  test('With a GET api/users/{userId} request, we are trying to get a deleted object by id', async () => {
    userList.set(TEST_ID, { id: TEST_ID, ...TEST_DATA });
    await fetch(`http://localhost:${port}/api/users/${TEST_ID}`, {
      method: 'DELETE',
    });
    const response = await fetch(
      `http://localhost:${port}/api/users/${TEST_ID}`,
    );
    expect(await response.json()).toEqual(NOT_FOUND);
  });
});
