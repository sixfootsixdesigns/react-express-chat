import React from 'react';
import { Chat } from '../Chat/Chat';
import io from 'socket.io-client';

const socket = io('localhost:4001');

export class App extends React.Component {
  public componentWillUnmount() {
    socket.close();
  }

  public render() {
    return <Chat socket={socket} />;
  }
}
