import React from 'react';
import { IUser } from '../../../server/store';

interface ActiveUsersProps {
  users: IUser[];
  currentUser?: IUser;
  loading?: boolean;
}

export class ActiveUsers extends React.Component<ActiveUsersProps> {
  public render() {
    const { users, currentUser, loading } = this.props;

    if (loading) {
      return (
        <div className="ActiveUsers">
          <h2>Users</h2>
          loading...
        </div>
      );
    }

    return (
      <div className="ActiveUsers">
        <h2>Users</h2>
        {users.length ? (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {currentUser && currentUser.id === user.id && '** '}
                {user.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Active Users</p>
        )}
      </div>
    );
  }
}
