import express from 'express';
import * as bodyParser from 'body-parser';
import { routes } from './routes';
import * as http from 'http';
import socket from 'socket.io';
import { storeAPI, IUser } from './store';

const app = express();

const appServer = http.createServer(app);
const socketIO = socket(appServer);

app
  .use(bodyParser.json())
  .use(routes(socketIO))
  .use(express.static('build'));

socketIO.on('connection', socket => {
  socket.on('disconnecting', (user: IUser) => {
    storeAPI.dropUser(user);
    socketIO.emit('UserLeft', storeAPI.getUsers());
  });
});

export { appServer, socketIO };
