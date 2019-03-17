import { Router } from 'express';
import { storeAPI } from './store';
import socket from 'socket.io';

export const routes = (socket: socket.Server) => {
  const router = Router();

  router
    .get('/messages', (req: Request, res: any) => {
      res.json(storeAPI.getMessages());
    })

    .post('/add-message', (req: Request, res: any) => {
      const body: any = req.body;
      const message = storeAPI.addMessage(body.author, body.message);

      socket.emit('NewMessage', storeAPI.getMessages());

      res.status(201);
      res.json(message);
    })

    .get('/users', (req: Request, res: any) => {
      res.json(storeAPI.getUsers());
    })

    .post('/add-user', (req: Request, res: any) => {
      const body: any = req.body;
      const user = storeAPI.addUser(body.username);

      socket.emit('UserAdded', storeAPI.getUsers());

      res.status(201);
      res.json(user);
    });

  return router;
};
