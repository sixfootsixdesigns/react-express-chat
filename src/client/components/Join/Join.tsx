import React from 'react';

interface JoinProps {
  addUser: (name: string) => void;
}

interface JoinState {
  username: string;
}

export class Join extends React.Component<JoinProps, JoinState> {
  public state = {
    username: ''
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: event.currentTarget.value
    });
  };

  handleJoin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (this.state.username) {
      this.props.addUser(this.state.username);
    }
  };

  public render() {
    const { username } = this.state;
    return (
      <div className="JoinWrapper">
        <div className="Join">
          <input
            type="text"
            placeholder="Enter your name"
            required={true}
            onChange={this.handleChange}
            value={username}
          />
          <button onClick={this.handleJoin}>Join</button>
        </div>
      </div>
    );
  }
}
