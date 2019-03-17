import supertest from 'supertest';
import { appServer } from '../app';
import { storeAPI } from '../store';
import io from 'socket.io-client';
import * as http from 'http';
import { AddressInfo } from 'net';

describe('App', () => {
  let server: http.Server;
  let serverAddress: any | AddressInfo;
  let socketA: SocketIOClient.Socket;
  let socketB: SocketIOClient.Socket;

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

  describe('UserLeft', () => {
    beforeEach(async () => {
      socketA = io.connect(
        `//[${serverAddress.address}]:${serverAddress.port}`,
        {
          transports: ['websocket']
        }
      );

      socketB = io.connect(
        `//[${serverAddress.address}]:${serverAddress.port}`,
        {
          transports: ['websocket']
        }
      );

      await Promise.all([
        new Promise(resolve => {
          socketA.on('connect', () => {
            resolve();
          });
        }),
        new Promise(resolve => {
          socketB.on('connect', () => {
            resolve();
          });
        })
      ]);
    });

    afterEach(() => {
      if (socketA.connected) {
        socketA.disconnect();
      }
      if (socketB.connected) {
        socketB.disconnect();
      }
    });

    it('emits UserLeft when someone disonnects', async () => {
      const callback = jest.fn();
      const socketUserA = storeAPI.addUser('Dave');
      const socketUserB = storeAPI.addUser('Steve');

      socketB.on('UserLeft', callback);
      socketA.emit('disconnecting', socketUserA);
      socketA.disconnect();

      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      expect(callback).toHaveBeenCalledWith([socketUserB]);
    });
  });
});
