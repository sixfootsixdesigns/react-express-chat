import * as shortid from 'shortid';

export interface IMessage {
  author: IUser;
  message: string;
  id: string;
}

export interface IUser {
  name: string;
  id: string;
}

const MAX_MESSAGES = 50;
let users: IUser[] = [];
let messages: IMessage[] = [];

const addMessage = (author: IUser, message: string) => {
  const data: IMessage = {
    author: author,
    message: message,
    id: shortid.generate()
  };
  messages.push(data);

  messages = messages.slice(MAX_MESSAGES * -1);

  return data;
};

const dropUser = (remove: IUser) => {
  users = users.filter(user => user.id !== remove.id);
};

const addUser = (username: string) => {
  const user: IUser = {
    name: username,
    id: shortid.generate()
  };
  users.push(user);
  return user;
};

const getUsers = () => users;
const getMessages = () => messages;

const reset = () => {
  users = [];
  messages = [];
};

export const storeAPI = {
  MAX_MESSAGES,
  addUser,
  getUsers,
  getMessages,
  addMessage,
  reset,
  dropUser
};
