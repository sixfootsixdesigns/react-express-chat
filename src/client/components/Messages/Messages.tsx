import React from 'react';
import { IMessage } from '../../../server/store';

interface MessagesProps {
  messages: IMessage[];
  loading?: boolean;
}

export class Messages extends React.Component<MessagesProps> {
  public render() {
    const { loading, messages } = this.props;

    if (loading) {
      return <div className="Messages">loading...</div>;
    }

    return (
      <div className="Messages">
        {(messages.length &&
          messages.map(message => (
            <div key={message.id}>
              <strong>{message.author.name}</strong>: {message.message}
            </div>
          ))) || <div>No Messages Yet.</div>}
      </div>
    );
  }
}
