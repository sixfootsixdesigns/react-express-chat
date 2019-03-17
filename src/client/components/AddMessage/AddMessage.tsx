import React from 'react';

interface AddMessageProps {
  addMessage: (message: string) => void;
}

interface AddMessageState {
  message: string;
}

export class AddMessage extends React.Component<
  AddMessageProps,
  AddMessageState
> {
  public state = {
    message: ''
  };

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      message: event.currentTarget.value
    });
  };

  handleAddMessage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (this.state.message) {
      this.props.addMessage(this.state.message);
      this.setState({
        message: ''
      });
    }
  };

  public render() {
    const { message } = this.state;
    return (
      <div className="AddMessageWrapper">
        <div className="AddMessage">
          <textarea
            placeholder="Enter your message"
            onChange={this.handleChange}
            value={message}
          />
          <button onClick={this.handleAddMessage}>Post</button>
        </div>
      </div>
    );
  }
}
