import * as React from 'react';
import {
  render,
  fireEvent,
  wait,
  getByText,
  getByPlaceholderText,
  cleanup
} from 'react-testing-library';
import { Chat } from '../Chat';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { SocketIO, Server } from 'mock-socket';

declare const window: any;

describe('Chat Component', () => {
  let axiosMock: MockAdapter;
  const fakeURL = 'ws://localhost:8080';
  const mockServer = new Server(fakeURL);
  window.io = SocketIO;
  const client = io(fakeURL);

  const joinChat = async (container: HTMLElement) => {
    const input = getByPlaceholderText(container, 'Enter your name');
    fireEvent.change(input, {
      target: { value: 'dave' }
    });

    const button = getByText(container, 'Join');
    fireEvent.click(button);

    await wait(() => {});
  };

  const postMessage = async (container: HTMLElement, message = 'hello') => {
    const input = getByPlaceholderText(container, 'Enter your message');
    fireEvent.change(input, {
      target: { value: message }
    });

    const button = getByText(container, 'Post');
    fireEvent.click(button);
    await wait(() => {});
  };

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    axiosMock.onPost(`/add-user`).reply(201, { name: 'dave', id: '123' });
  });

  afterEach(() => {
    axiosMock.restore();
    cleanup();
  });

  it('should render with join screen', async () => {
    const { container } = render(<Chat socket={client} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render chat after joining', async () => {
    axiosMock.onGet(`/users`).reply(200, []);
    axiosMock.onGet(`/messages`).reply(200, []);

    const { container } = render(<Chat socket={client} />);

    await joinChat(container);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render existing users and messages once joined', async () => {
    axiosMock.onGet(`/users`).reply(200, [{ name: 'dave', id: '123' }]);
    axiosMock
      .onGet(`/messages`)
      .reply(200, [
        { author: { name: 'dave', id: '123' }, message: 'hi', id: 'zzz' }
      ]);

    const { container } = render(<Chat socket={client} />);

    await joinChat(container);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call add-message when posting a new message', async () => {
    axiosMock.onPost(`/add-message`).reply(201);
    axiosMock.onGet(`/users`).reply(200, []);
    axiosMock.onGet(`/messages`).reply(200, []);

    const { container } = render(<Chat socket={client} />);

    await joinChat(container);
    await postMessage(container);

    expect(axiosMock.history.post.length).toBe(2);
  });

  it('should add users if UserAdded is fired', async () => {
    axiosMock.onGet(`/users`).reply(200, []);
    axiosMock.onGet(`/messages`).reply(200, []);

    const { container } = render(<Chat socket={client} />);

    await joinChat(container);

    mockServer.emit('UserAdded', { name: 'bob', id: '10' });

    expect(container.querySelector('.ActiveUsers')).toMatchSnapshot();
  });

  it('should update users if UserLeft is fired', async () => {
    axiosMock
      .onGet(`/users`)
      .reply(200, [{ name: 'dave', id: '1' }, { name: 'tim', id: '2' }]);
    axiosMock.onGet(`/messages`).reply(200, []);

    const { container } = render(<Chat socket={client} />);

    await joinChat(container);

    expect(container.querySelector('.ActiveUsers')).toMatchSnapshot();

    mockServer.emit('UserLeft', { name: 'dave', id: '1' });

    expect(container.querySelector('.ActiveUsers')).toMatchSnapshot();
  });

  it('should add message if NewMessage is fired', async () => {
    axiosMock.onGet(`/users`).reply(200, []);
    axiosMock.onGet(`/messages`).reply(200, []);

    const { container } = render(<Chat socket={client} />);

    await joinChat(container);

    mockServer.emit('NewMessage', {
      author: { name: 'bob', id: '10' },
      message: 'henlo',
      id: 'ladfj'
    });

    expect(container.querySelector('.Messages')).toMatchSnapshot();
  });
});
