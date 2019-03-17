import supertest from 'supertest';
import { appServer } from '../app';
import { storeAPI } from '../store';
import io from 'socket.io-client';
import * as http from 'http';
import { AddressInfo } from 'net';

describe('Routes', () => {
  let server: http.Server;
  let serverAddress: any | AddressInfo;
  let socket: SocketIOClient.Socket;

  beforeAll(() => {
    server = appServer;
    serverAddress = server.listen().address();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    storeAPI.reset();
  });

  describe('GET routes', () => {
    it('gets messages', async () => {
      const message = storeAPI.addMessage(
        {
          name: 'Bob',
          id: '1'
        },
        'my first message'
      );

      await supertest(server)
        .get('/messages')
        .expect(200, [message]);
    });

    it('gets users', async () => {
      const user = storeAPI.addUser('Bob');

      await supertest(server)
        .get('/users')
        .expect(200, [user]);
    });
  });

  describe('POST routes', () => {
    beforeEach(async () => {
      socket = io.connect(
        `//[${serverAddress.address}]:${serverAddress.port}`,
        {
          transports: ['websocket']
        }
      );
      await new Promise(resolve => {
        socket.on('connect', () => {
          resolve();
        });
      });
    });

    afterEach(() => {
      if (socket.connected) {
        socket.disconnect();
      }
    });

    it('adds a user and emits UserAdded', async () => {
      const callback = jest.fn();
      const username = 'Dave';

      socket.on('UserAdded', callback);

      const result = await supertest(server)
        .post('/add-user')
        .send({ username })
        .expect(201);

      const users = storeAPI.getUsers();

      expect(users.length).toEqual(1);
      expect(users[0].name).toEqual(username);
      expect(result.body).toEqual(users[0]);
      expect(callback).toHaveBeenCalledWith(users);
    });

    it('adds a message and emits NewMessage', async () => {
      const callback = jest.fn();
      const message = {
        author: {
          name: 'Bob',
          id: '1'
        },
        message: 'Hello'
      };

      socket.on('NewMessage', callback);

      const result = await supertest(server)
        .post('/add-message')
        .send(message)
        .expect(201);

      const messages = storeAPI.getMessages();

      expect(messages.length).toEqual(1);
      expect(messages[0].author).toEqual(message.author);
      expect(result.body).toEqual(messages[0]);
      expect(callback).toHaveBeenCalledWith(messages);
    });
  });
});
