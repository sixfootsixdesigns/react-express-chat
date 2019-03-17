import React from 'react';
import { IMessage, IUser } from '../../../server/store';
import './chat.scss';
import { ActiveUsers } from '../ActiveUsers/ActiveUsers';
import { Messages } from '../Messages/Messages';
import { AddMessage } from '../AddMessage/AddMessage';
import { Join } from '../Join/Join';
import axios from 'axios';
import { socketIO } from '../../../server/app';

interface ChatState {
  messages?: IMessage[];
  user?: IUser;
  users?: IUser[];
  loadingMessages: boolean;
  loadingUsers: boolean;
}

interface ChatProps {
  socket: SocketIOClient.Socket;
}

export class Chat extends React.Component<ChatProps, ChatState> {
  private _isMounted: boolean = false;

  get isMounted(): boolean {
    return this._isMounted;
  }

  set isMounted(mountedStatus: boolean) {
    this._isMounted = mountedStatus;
  }

  public state = {
    messages: [],
    user: undefined,
    users: [],
    loadingMessages: false,
    loadingUsers: false
  };

  public handleBeforeUnload = () => {
    const { socket } = this.props;
    socket && socket.emit('disconnecting', this.state.user);
  };

  public componentDidMount() {
    this.isMounted = true;
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  public componentWillUnmount() {
    this.isMounted = false;
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  addMessage = (message: string) => {
    axios
      .post('/add-message', {
        author: this.state.user,
        message
      })
      .catch(() => {
        console.log('error');
      });
  };

  addUser = (username: string) => {
    axios
      .post('/add-user', {
        username
      })
      .then(resp => {
        this.isMounted &&
          this.setState({
            user: resp.data
          });

        this.getInitialData();
      })
      .catch(() => {
        console.log('error');
      });
  };

  public render() {
    const { messages, users, user, loadingMessages, loadingUsers } = this.state;

    if (!user) {
      return <Join addUser={this.addUser} />;
    }

    return (
      <div className="Chat">
        <div className="MessageWrapper">
          <div className="MessageInner">
            <Messages loading={loadingMessages} messages={messages} />
            <AddMessage addMessage={this.addMessage} />
          </div>
        </div>
        <ActiveUsers loading={loadingUsers} currentUser={user} users={users} />
      </div>
    );
  }

  private getInitialData() {
    const { socket } = this.props;

    this.getActiveUsers();
    this.getMessages();

    if (socket) {
      socket.on('NewMessage', (messages: IMessage[]) => {
        if (!Array.isArray(messages)) {
          messages = [messages];
        }
        this.isMounted && this.setState({ messages });
      });

      socket.on('UserAdded', (users: IUser[]) => {
        if (!Array.isArray(users)) {
          users = [users];
        }
        this.isMounted && this.setState({ users });
      });

      socket.on('UserLeft', (users: IUser[]) => {
        if (!Array.isArray(users)) {
          users = [users];
        }
        this.isMounted && this.setState({ users });
      });
    }
  }

  private getActiveUsers() {
    axios
      .get('/users')
      .then(resp => {
        this.isMounted &&
          this.setState({
            users: resp.data
          });
      })
      .catch(er => {
        console.log('error');
      });
  }

  private getMessages() {
    axios
      .get('/messages')
      .then(resp => {
        this.isMounted &&
          this.setState({
            messages: resp.data
          });
      })
      .catch(er => {
        console.log('error');
      });
  }
}
